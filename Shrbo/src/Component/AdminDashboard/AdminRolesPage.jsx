import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Space,
  Table,
  Modal,
  Checkbox,
} from "antd";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminNavigation/AdminHeader";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";

const { confirm } = Modal;
const { Option } = Select;

const AdminRolesPage = () => {
  const [admins, setAdmins] = useState([
    { id: 1, name: "Admin 1", role: "Super Admin" },
    { id: 2, name: "Admin 2", role: "Admin" },
    // Add more admin data as needed
  ]);

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [newAdminModalVisible, setNewAdminModalVisible] = useState(false);
  const [adminActionsModalVisible, setAdminActionsModalVisible] =
    useState(false);

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
      title: "Role",
      dataIndex: "role",
      key: "role",
    },

    {
      title: "Alias Name",
      dataIndex: "alias", // Update to "alias"
      key: "alias",
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

          <Button>Delete</Button>
        </Space>
      ),
    },
  ];

  const showAdminActionsModal = (admin) => {
    setSelectedAdmin(admin);
    setAdminActionsModalVisible(true);
  };

  const handleRoleChange = () => {
    // Handle role change and update the admin's role.
    // You can make an API call to update the role on the server.
    // For demonstration purposes, we'll update the role locally.
    const updatedAdmins = admins.map((admin) => {
      if (admin.id === selectedAdmin.id) {
        return { ...admin, role: form.getFieldValue("role") };
      }
      return admin;
    });

    setAdmins(updatedAdmins);
    setRoleModalVisible(false);
  };

  const showRoleModal = (admin) => {
    setSelectedAdmin(admin);
    form.setFieldsValue({ role: admin.role });
    setRoleModalVisible(true);
  };

  const handleCreateNewAdmin = (values) => {
    const newAdmin = {
      id: admins.length + 1,
      name: values.username,
      role: values.role,
      alias: values.aliasname,
    };
    setAdmins([...admins, newAdmin]);

    setNewAdminModalVisible(false);
    newAdminForm.resetFields();

    console.log("Form data submitted:", values);
  };

  const handleAdminActionsSubmit = (values) => {
    // Handle the selected admin actions and render to the console
    console.log("Admin Actions for", selectedAdmin.name, ":", values);
    setAdminActionsModalVisible(false);
  };

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="bg-orange-400  text-white hidden md:block md:w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>
        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h1>Admin Roles</h1>
          <div className="mb-4">
            <Button
              type="primary"
              onClick={() => setNewAdminModalVisible(true)}
            >
              Create New Admin
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={admins.map((admin) => ({ ...admin, key: admin.id }))}
            />
          </div>

          <Modal
            title="Change Admin Role"
            open={roleModalVisible}
            onOk={handleRoleChange}
            onCancel={() => setRoleModalVisible(false)}
          >
            <Form form={form} layout="vertical">
              <Form.Item name="role" label="Select Role">
                <Select>
                  <Option value="Super Admin">Super Admin</Option>
                  <Option value="Admin">Admin</Option>
                </Select>
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
                rules={[{ required: true, message: "Please enter a username" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="aliasname"
                label="aliasname"
                rules={[{ required: true, message: "Please enter a Alias Name" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter a password" }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item name="role" label="Select Role">
                <Select>
                  <Option value="Super Admin">Super Admin</Option>
                  <Option value="Admin">Admin</Option>
                </Select>
              </Form.Item>
              <FormItem>
                <Button htmlType="submit" type="primary">
                  Submit
                </Button>
              </FormItem>
            </Form>
          </Modal>
          <Modal
            title="Select Admin Role Permissions"
            open={adminActionsModalVisible}
            onOk={() => adminActionsForm.submit()}
            onCancel={() => setAdminActionsModalVisible(false)}
            footer={[
              <Button
                key="cancel"
                onClick={() => setAdminActionsModalVisible(false)}
              >
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={() => adminActionsForm.submit()}
              >
                Submit
              </Button>,
            ]}
          >
            <Form form={adminActionsForm} onFinish={handleAdminActionsSubmit}>
              <Form.Item
                name="permissions"
                // Remove the "required" rule to allow submission without any checkbox selected
              >
                <Checkbox.Group style={{ width: "100%" }}>
                  <div>
                    <h3 className="font-bold text-xl">Role permissions</h3>
                    <Checkbox value="ViewRolePermissions">
                      Can view role permissions
                    </Checkbox>
                  </div>
                  <div>
                    <h3>Transactions permissions</h3>
                    <Checkbox value="ViewTransactions">
                      Can view transactions
                    </Checkbox>
                    <Checkbox value="ViewRefunds">Can view refunds</Checkbox>
                    <Checkbox value="LogRefunds">Can log refunds</Checkbox>
                  </div>
                  <div>
                    <h3>Customers permissions</h3>
                    <Checkbox value="ViewCustomers">
                      Can view customers
                    </Checkbox>
                    <Checkbox value="CreateCustomers">
                      Can create customers
                    </Checkbox>
                    <Checkbox value="EditCustomers">
                      Can edit customers
                    </Checkbox>
                    <Checkbox value="BlacklistWhitelistCustomers">
                      Can blacklist/whitelist customers
                    </Checkbox>
                  </div>
                  <div>
                    <h3>Balances permissions</h3>
                    <Checkbox value="ViewBalances">Can view balances</Checkbox>
                    <Checkbox value="FundBalance">Can fund balance</Checkbox>
                    <Checkbox value="ViewSettlements">
                      Can view settlements
                    </Checkbox>
                    <Checkbox value="ViewBalanceHistory">
                      Can view balance history
                    </Checkbox>
                  </div>
                  <div>
                    <h3>Transfers permissions</h3>
                    <Checkbox value="ViewTransfers">
                      Can view transfers
                    </Checkbox>
                    <Checkbox value="CreateTransfers">
                      Can create transfers
                    </Checkbox>
                    <Checkbox value="ApproveDisapproveTransfers">
                      Can approve/disapprove transfers
                    </Checkbox>
                  </div>
                </Checkbox.Group>
              </Form.Item>
              <div>
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => adminActionsForm.submit()}
                >
                  Submit
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminRolesPage;
