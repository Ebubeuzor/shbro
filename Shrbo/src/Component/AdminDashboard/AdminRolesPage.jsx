import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Space,
  Table,
  Modal,
  Checkbox,
  Spin,
} from "antd";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminNavigation/AdminHeader";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import Axios from "../../Axios";
import { notification } from "antd";
import CustomAdminActionsModal from "../CustomAdminActionsModal";

const { confirm } = Modal;
const { Option } = Select;

const AdminRolesPage = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [newAdminModalVisible, setNewAdminModalVisible] = useState(false);
  const [adminActionsModalVisible, setAdminActionsModalVisible] =
    useState(false);
  const [viewRolePermissionsChecked, setViewRolePermissionsChecked] =
    useState(false);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true); // State variable for loading spinner

  const [form] = Form.useForm();
  const [newAdminForm] = Form.useForm();
  const [adminActionsForm] = Form.useForm();

  const columns = [
    {
      title: "Admin Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "adminStatus",
      key: "adminStatus",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },

    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => showRoleModal(record)}>Change Role</Button>
          <Button onClick={() => showAdminActionsModal(record)}>
            Select Role
          </Button>

          <Button onClick={() => handleDeleteAdmin(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const showAdminActionsModal = (admin) => {
    setSelectedAdmin(admin);
    setAdminActionsModalVisible(true);
  };

  const handleRoleChange = async (role) => {
    try {
      await updateAdminStatus(selectedAdmin.id, role);
      const updatedAdmins = admins.map((admin) => {
        if (admin.id === selectedAdmin.id) {
          return { ...admin, role };
        }
        return admin;
      });
      setAdmins(updatedAdmins);
      setRoleModalVisible(false);
    } catch (error) {
      console.error("Error updating admin role:", error);
    }
  };

  const showRoleModal = (admin) => {
    setSelectedAdmin(admin);
    form.setFieldsValue({ role: admin.role });
    setRoleModalVisible(true);
  };

  const handleCreateNewAdmin = async (values) => {
    try {
      const adminData = {
        name: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
      };

      await createAdmin(adminData);

      setNewAdminModalVisible(false);
      newAdminForm.resetFields();
    } catch (error) {
      console.error("Error creating admin:", error);
    }
  };

  const createAdmin = async (adminData) => {
    try {
      const response = await Axios.post("/createAdmin", adminData);
      console.log("Admin created successfully:", response.data);
      notification.success({
        message: "Admin Created",
        description: "The admin user was created successfully.",
      });

      setTimeout(() => {
        window.location.reload();
      }, 500);
      return response.data;
    } catch (error) {
      console.error("Error creating admin:", error);
      notification.error({
        message: "Error",
        description: "An error occurred while creating the admin user.",
      });
      throw error;
    }
  };

  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        const response = await Axios.get("/getAllAdminUsers");
        const formattedData = response.data.adminUsers.map((data) => ({
          key:data.id,
         ...data
        }));
        setAdmins(formattedData);
        setLoading(false); // Set loading to false after data is fetched
        console.log("ss",formattedData);
      } catch (error) {
        console.error("Error fetching admin users:", error);
      }
    };

    fetchAdminUsers();
  }, []);

  useEffect(() => {
    const hasViewRolePermissions = selectedAdmin?.adminRoles.some(
      (role) => role.rolePermission === "ViewRolePermissions"
    );
    setViewRolePermissionsChecked(hasViewRolePermissions);
    console.log("Has ViewRolePermissions:", hasViewRolePermissions);
  }, [selectedAdmin]);

  console.log(permissions);

  const handleAdminActionsSubmit = async (values) => {
    try {
      await Axios.post(`/assignRolesToAdmin/${selectedAdmin.id}`, {
        permission: permissions,
      });

      notification.success({
        message: "Roles Assigned",
        description: "Roles have been successfully assigned to the admin.",
      });

      setTimeout(() => {
        window.location.reload();
      }, 500);
      setAdminActionsModalVisible(false);
    } catch (error) {
      console.error("Error assigning roles to admin:", error);
      notification.error({
        message: "Error",
        description:
          "Failed to assign roles to the admin. Please try again later.",
      });
    }
  };

  const handleDeleteAdmin = async (userId) => {
    try {
      await Axios.delete(`/deleteAdmin/${userId}`);

      setAdmins(admins.filter((admin) => admin.id !== userId));

      notification.success({
        message: "Admin Deleted",
        description: "The admin user was deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting admin:", error);
      notification.error({
        message: "Error",
        description: "An error occurred while deleting the admin user.",
      });
    }
  };

  const updateAdminStatus = async (userId, status) => {
    try {
      const response = await Axios.put(`/updateAdminStatus/${userId}`, {
        adminStatus: status,
      });
      console.log("Admin status updated successfully:", response.data);
      notification.success({
        message: "Admin Status Updated",
        description: "The admin status was updated successfully.",
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
      // Optionally, you can handle the response or update your UI
    } catch (error) {
      console.error("Error updating admin status:", error);
      notification.error({
        message: "Error Updating Admin Status",
        description: "An error occurred while updating the admin status.",
      });
      // Handle error appropriately
    }
  };


  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="bg-orange-400 overflow-scroll example  text-white hidden md:block md:w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>
        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h1>Admin Roles</h1>
          <div className="mb-4">
            <p className="text-gray-400 text-sm">
              The Admin Roles section provides an overview of all the administrators on your platform.
            </p>
          </div>
          <div className="mb-4">
            <Button
              type="primary"
              onClick={() => setNewAdminModalVisible(true)}
            >
              Create New Admin
            </Button>
          </div>
          {loading ? (
            <Spin size="large" />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table columns={columns} dataSource={admins} />
              </div>
              <Modal
                title="Change Admin Role"
                open={roleModalVisible}
                onOk={handleRoleChange}
                onCancel={() => setRoleModalVisible(false)}
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={(values) => handleRoleChange(values.role)}
                >
                  <Form.Item name="role" label="Select Role">
                    <Select>
                      <Option value="super admin">Super Admin</Option>
                      <Option value="admin">Admin</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
              <Modal
                title="Create New Admin"
                open={newAdminModalVisible}
                onOk={handleCreateNewAdmin}
                onCancel={() => setNewAdminModalVisible(false)}
              >
                <Form
                  form={newAdminForm}
                  layout="vertical"
                  onFinish={handleCreateNewAdmin}
                >
                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                      { required: true, message: "Please enter a username" },
                      {
                        validator: (_, value) => {
                          const names = value.trim().split(" ");
                          if (names.length !== 2) {
                            return Promise.reject(
                              "Username must contain two names"
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Please enter an email" },
                      {
                        type: "email",
                        message: "Please enter a valid email address",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true, message: "Please enter a password" },
                      {
                        validator: (_, value) => {
                          if (
                            !/(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z]).{6,}/.test(
                              value
                            )
                          ) {
                            return Promise.reject(
                              "Password must contain at least one number, one character, and one uppercase letter"
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item name="role" label="Select Role">
                    <Select>
                      <Option value="super admin">Super Admin</Option>
                      <Option value="admin">Admin</Option>
                    </Select>
                  </Form.Item>
                  <FormItem>
                    <Button htmlType="submit" type="primary">
                      Submit
                    </Button>
                  </FormItem>
                </Form>
              </Modal>
              <CustomAdminActionsModal
                visible={adminActionsModalVisible}
                onCancel={() => setAdminActionsModalVisible(false)}
                onSubmit={handleAdminActionsSubmit}
                selectedPermissions={
                  selectedAdmin?.adminRoles.map(
                    (role) => role.rolePermission
                  ) || []
                }
                onPermissionsChange={(permissions) =>
                  setPermissions(permissions)
                }
                adminRolesPermissions={
                  selectedAdmin?.adminRoles.map(
                    (role) => role.rolePermission
                  ) || []
                }
                userId={selectedAdmin?.id}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRolesPage;
