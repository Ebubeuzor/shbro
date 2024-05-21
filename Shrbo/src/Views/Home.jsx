import React, { useState, useEffect } from "react";
import SearchLocation from "../Component/SearchLocation";
import CategoryHeader from "../Component/Navigation/CategoryHeader";
import Listings from "../Component/ListingInfo/Listings";
import Header from "../Component/Navigation/Header";
import Hamburger from "../Component/Navigation/Hamburger";
import { toast } from "react-toastify"; // Import toast
import Modal from "../Component/SearchModal/Modal";
import searchIcon from "../assets/svg/search-icon.svg";
import BottomNavigation from "../Component/Navigation/BottomNavigation";
import Footer from "../Component/Navigation/Footer";
import RateHouseModal from "../Component/RateHouseModal";
import FilterModal from "../Component/Filter/FilterModal";
import ChatSupport from "../Component/ChatBot/ChatSupport";
import CityCard from "../Component/CityCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "../Axios";
import Logo from "../assets/logo.png";
import { useStateContext } from "../ContextProvider/ContextProvider";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchButtonFixed, setIsSearchButtonFixed] = useState(false);
  const [houseDetails, setHouseDetails] = useState(null); // Store house details here
  const [isRateHouseModalOpen, setIsRateHouseModalOpen] = useState(true);
  const { setUser, setToken, token, setHost, setAdminStatus, user ,setCoHost} =useStateContext();
  const [loading, setLoading] = useState(true);
  const [showMoreLoading, setShowMoreLoading] = useState(true);
  const [listingLoading, setListingLoading] = useState(true);
  const [homeImage, setHomeImage] = useState("");
  const [homeTitle, setHomeTitle] = useState("");
  const [homeSubTitle, setHomeSubTitle] = useState("");
  const [listings, setListings] = useState();
  const [category, setCategory] = useState();
  const [listingType, setListingType] = useState(""); //I'm using this state to know what type of listing i'm getting based on the particular Api i'm making a request from
  const [per_page, setPerPage] = useState(40); // handles the amount of listing that can show at a time
  const [current_page, setCurrent_page] = useState();
  const [last_page, setLast_page] = useState();
  const [receiverId, setReceiverId] = useState(""); // Initial receiver ID is set to 1

  // const [pendingReview,setPendingReview]=useState([]);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openRateHouseModal = () => {
    setIsRateHouseModalOpen(true);
  };

  const closeRateHouseModal = () => {
    deletePendingReview(houseDetails[0].id);
    setIsRateHouseModalOpen(false);
  };

  console.log(token);

  useEffect(() => {
    // Add an event listener to handle scrolling
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSearchButtonFixed(true);
      } else {
        setIsSearchButtonFixed(false);
      }
    };

    // Attach the event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Extract the parameters from the URL
    const params = new URLSearchParams(window.location.search);
    const verified = params.get("verified");
    const remtoken = params.get("remtoken");
    const ustoken = params.get("ustoken");

    const fetchUserData = async () => {
      try {

        // Log out the parameters
        console.log("Verified:", verified);
        console.log("Remtoken:", remtoken);
        console.log("Ustoken:", ustoken);

        // Make a request to get the user data with parameters
        const response = await axios.get(
          `/verify-tokens/${remtoken}/${ustoken}`
        );
        console.log("Response Data:", response.data);
        console.log(response.data.id);

        // Set the user data in state
        setUser(response.data.user);
        console.log("User Data:", response.data);

        // Set the host value in state context
        setHost(response.data.user.host);
        setCoHost(response.data.user.co_host)
        console.log("Host:", response.data.host);
        console.log("CoHost:", response.data.user.co_host);
        setToken(ustoken);
        setAdminStatus(response.data.user.adminStatus);

        // Log 'yes' to the console
        console.log("yes");
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        // Set loading to false regardless of success or error
        setLoading(false);
      }
    };

    // Call the fetchUserData function when the component mounts
    if(verified&&remtoken&&ustoken){
      setLoading(true);

      fetchUserData();
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Make a request to get the user data
        const response = await axios.get("/user"); // Adjust the endpoint based on your API

        // Set the user data in state
        setUser(response.data);
        console.log(response.data.host);

        console.log("yes", response.data);
        setHost(response.data.host);
        setAdminStatus(response.data.adminStatus);
        setCoHost(response.data.co_host)
        console.log("CoHost:", response.data.co_host);
        localStorage.setItem('receiverid', response.data.id);

      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        // Set loading to false regardless of success or error
        setLoading(false);
      }
    };

 

    if(token){
      setLoading(true);
      fetchUserData();
    }
  }, [token]);

  useEffect(() => {
    const tokens = token;
    const receiverid = receiverId;

    localStorage.setItem('tokens', tokens);
    localStorage.setItem('receiverid', receiverid);
  }, []);

  console.log();

  // Home Page Data
  const receiverIds = localStorage.getItem('receiverid');

  console.log(receiverIds);

  useEffect(() => {
    const homePageData = async () => {
      await axios
        .get("/homepage")
        .then((response) => {
          console.log("HomePage", response.data.data[0]);
          const homePageData = response.data.data[0];

          setHomeImage(homePageData.image);
          setHomeTitle(homePageData.title);
          setHomeSubTitle(homePageData.subtitle);
        })
        .catch((error) => {
          console.error(error);
        }).finally(()=>{
          if(!token){  // this is so the loader does not stop showing when the request to /user is being made
            setLoading(false);

          }

        });
    };

    homePageData();
  }, []);

  // View Count (register visitors)

  useEffect(() => {
    const viewCount = async () => {
      await axios
        .get("/view-count")
        .then((response) => {
          console.log("view-Count", response);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    viewCount();
  }, []);


  useEffect(() => {
    // Simulate fetching house details after 5 seconds
    const timer = setTimeout(() => {
      setHouseDetails({
        name: "4 bedroom neatly compound hehehe",
        location: "2b Jikwoyi Abuja",
        // Add more house details here
      });
      openRateHouseModal(); // Show the RateHouseModal after fetching details
    }, 500000000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);
  const cities = [
    {
      name: "Lagos",
      description:
        "Lagos, Nigeria's largest city, is a bustling metropolis known for its vibrant energy and rich cultural diversity.",
      image: "https://www.petan.org/wp-content/uploads/2017/09/lagos-city.jpg", // Provide the image path
      facts: [
        "Home to Nollywood, Nigeria's booming film industry.",
        "More than 20 million people live here.",
      ],
      destinations: ["Victoria Island", "Lekki Peninsula", "Tarkwa Bay Beach"],
    },
    {
      name: "Abuja",
      description:
        "Abuja is Nigeria's capital city and is known for its modernity and meticulously planned layout. As the center of government, it offers a blend of contemporary architecture, lush green spaces, and cultural attractions.",
      image:
        "https://cdn.vanguardngr.com/wp-content/uploads/2021/12/ABUJA-1.jpg", // Provide the image path for Abuja
      facts: [
        "Abuja officially became the capital of Nigeria in 1991, replacing Lagos.",
        `The Aso Rock is a massive monolith that dominates the city's landscape and is considered one of the city's landmarks.`,
        "The National Mosque and National Church, located side by side, symbolize religious diversity and harmony in Nigeria.",
      ],
      destinations: [
        "Aso Rock for hiking and panoramic views.",
        "The Arts and Crafts Village for traditional Nigerian art and craftwork.",
        "Jabi Lake for water sports and relaxation.",
        "A visit to the Nigerian National Mosque and the National Christian Centre.",
        "Explore the Millennium Park for a peaceful escape in the heart of the city.",
      ],
    },

    {
      name: "Ibadan",
      description:
        'Ibadan, often referred to as the "ancient city," is one of the largest cities in Nigeria and is steeped in history. The city boasts a unique blend of tradition and modernity, making it a captivating destination for tourists.',
      image:
        "https://tribuneonlineng.com/wp-content/uploads/2023/07/ibadan-8-1.jpeg", // Provide the image path
      facts: [
        "Known for the towering Cocoa House, a historic skyscraper that was once the tallest building in tropical Africa.",
        "Home to the University of Ibadan, the oldest university in Nigeria.",
        "Famous for its rich Yoruba culture, including colorful festivals, music, and art.",
        `The city's largest market, Oja Oba, is a bustling hub for traditional crafts, fabrics, and spices.`,
        "Local delicacies like Amala and Ewedu soup are staples in Ibadan's culinary scene.",
      ],
      destinations: [
        "Cocoa House for a glimpse of colonial-era architecture.",
        "The University of Ibadan's serene campus.",
        "The National Museum for an exploration of Nigerian history and culture.",
        "The Old Oyo National Park for wildlife and nature enthusiasts.",
        "Oja Oba market to experience the city's vibrant trade culture.",
      ],
    },
    {
      name: "Kano",
      description:
        "Kano, located in northern Nigeria, is known for its rich history and is often regarded as the commercial and cultural heart of the north. The city offers a blend of tradition, art, and thriving commerce.",
      image:
        "https://media.premiumtimesng.com/wp-content/files/2023/06/FymeoeBXsAADI7b.jpeg", // Provide the image path
      facts: [
        "Kano's ancient city walls are a UNESCO World Heritage site and are among the most well-preserved city walls in Africa.",
        "The city is famous for its traditional dye pits, where colorful fabrics are created using ancient techniques.",
        "Kano's centuries-old Kurmi Market is one of the largest in West Africa, featuring a labyrinth of stalls and vendors.",
        "The city's traditional leaders hold significant influence and play a vital role in the community.",
        "Kano is renowned for its flavorful dishes, such as Suya (grilled meat skewers) and Fura da Nono (millet porridge with milk).",
      ],
      destinations: [
        "Kano's ancient city walls and gates for a journey back in time.",
        "The Gidan Makama Museum, which showcases local art and artifacts.",
        "Kurmi Market for a vibrant shopping experience.",
        "The Great Mosque of Kano, an architectural masterpiece.",
        "Sampling local cuisine and street food at various eateries.",
      ],
    },

    {
      name: "Port Harcourt",
      description:
        "Port Harcourt, the capital of Rivers State, is a vibrant and dynamic city known for its oil and gas industry. It offers a unique blend of modernity and natural beauty along the Niger Delta.",
      image:
        "https://i.pinimg.com/originals/f5/5c/6b/f55c6bb13e107015f4233121b1505cf7.jpg", // Provide the image path
      facts: [
        'The city is often referred to as the "Garden City" due to its lush greenery and numerous parks.',
        "Port Harcourt is a major hub for the Nigerian oil and gas industry, housing several multinational corporations.",
        "It's famous for its bustling street markets, including the famous Mile 1 Market.",
        "The city is a gateway to the Niger Delta, with access to the region's unique culture and traditions.",
        "Local dishes like Banga soup and Seafood Okro are popular in Port Harcourt.",
      ],
      destinations: [
        "Port Harcourt Pleasure Park for family-friendly entertainment.",
        "Isaac Boro Park, a serene escape in the city center.",
        "The Mile 1 Market for shopping and experiencing local life.",
        "The Bonny Island Ferry for exploring the Niger Delta.",
        "Sampling delicious local cuisine at waterfront restaurants.",
      ],
    },

    {
      name: "Enugu",
      description:
        'Enugu, often called the "Coal City," is located in the southeastern part of Nigeria. It is known for its lush landscapes, vibrant culture, and historical significance. Enugu offers a blend of natural beauty and a warm atmosphere.',
      image:
        "https://guardian.ng/wp-content/uploads/2020/06/enugu-1062x598.jpg", // Provide the image path
      facts: [
        "Enugu was the capital of the former Eastern Region during Nigeria's First Republic.",
        "The city boasts picturesque coal mines, with remnants of the mining industry.",
        "It's home to the Awhum Waterfall, a natural wonder hidden within the rainforest.",
        "Enugu is known for its rich cultural heritage, including traditional dances and festivals.",
        "Local cuisine features dishes like Ofe Nsala (white soup) and Akpu (fermented cassava paste).",
      ],
      destinations: [
        "Awhum Waterfall for a breathtaking natural experience.",
        "National Museum Enugu for local art and cultural artifacts.",
        "Polo Park Mall for shopping and entertainment.",
        "Milliken Hill for panoramic views of the city.",
        "Dining at Coal City Garden Restaurant for traditional and continental dishes.",
      ],
    },

    {
      name: "Owerri",
      description:
        "Owerri, the capital of Imo State, is a city known for its lively atmosphere, entertainment, and hospitality. The city offers a mix of modern infrastructure and traditional values.",
      image: "https://cimages.timbu.com/travel/2015/12/12086715673b.jpg", // Provide the image path
      facts: [
        "The city is renowned for its impressive roundabouts, each featuring a unique sculpture.",
        "Owerri is a hub for nightlife and entertainment, with numerous bars, clubs, and live music venues.",
        "The Mbari Cultural and Art Center is a treasure trove of Igbo culture and traditional art.",
        "Local artisans in Owerri craft intricate masquerade masks and sculptures.",
        "Traditional dishes like Ofe Owerri (Owerri soup) are a must-try for visitors.",
      ],
      destinations: [
        "Mbari Cultural and Art Center for an artistic journey.",
        "Dan Anyiam Stadium for sports and entertainment events.",
        "Eke Ukwu Owerri Market for shopping and souvenirs.",
        "Lake Nwaebere for relaxation and outdoor activities.",
        "Dining at Ibari Ogwa Village for local and continental cuisine.",
      ],
    },

    {
      name: "Benin City",
      description:
        "Benin City, the capital of Edo State, is known for its historical significance as the center of the ancient Benin Kingdom. Today, it offers a glimpse into Nigeria's royal heritage and a mix of tradition and progress.",
      image:
        "https://www.worldatlas.com/r/w1200/upload/04/3f/7a/shutterstock-1383820007.jpg", // Provide the image path
      facts: [
        "The city is famous for the historic Benin Bronzes, intricate artworks created during the Benin Empire.",
        "Benin City is home to the Oba's Palace, a UNESCO World Heritage site and the residence of the Oba of Benin.",
        "The city's central market, Oba Market, is a bustling hub for trade and commerce.",
        "It's known for its rich cultural festivals, including the Igue Festival.",
        "Local cuisine features dishes like Bitterleaf Soup and Eba (cassava dough).",
      ],
      destinations: [
        "Oba's Palace for a glimpse into Benin's royal history.",
        "The National Museum for art and historical artifacts.",
        "Oba Market for shopping and a taste of local life.",
        "Igun Street for bronze casting and traditional craftsmanship.",
        "Dining at Eghosa Restaurant for authentic Edo cuisine.",
      ],
    },

    {
      name: "Katsina",
      description:
        "Katsina, a city in northern Nigeria, is renowned for its rich history, culture, and craftsmanship. It offers a unique blend of tradition and modern living in a serene setting.",
      image:
        "https://i2.wp.com/hukpoly.edu.ng/wp-content/uploads/2020/07/history.jpg?fit=343%2C515&ssl=1", // Provide the image path
      facts: [
        "The city is the birthplace of Umaru Musa Yar'Adua, a former President of Nigeria.",
        "Katsina is known for its traditional textile industry, producing vibrant and intricate fabrics.",
        "It's famous for its ancient city wall and gates, a symbol of the city's history.",
        "The Argungu Fishing Festival, one of Nigeria's most famous cultural events, is celebrated nearby.",
        "Local cuisine features dishes like Fura da Nono (millet porridge) and Tuwo Shinkafa (rice pudding).",
      ],
      destinations: [
        "Katsina City Walls for a journey back in time.",
        "Gobarau Minaret, a historic Islamic monument.",
        "Kusugu Well for a cultural and historical experience.",
        "Daura Game Reserve for wildlife and nature enthusiasts.",
        "Dining at local markets and restaurants for traditional northern Nigerian cuisine.",
      ],
    },

    {
      name: "Warri",
      description:
        "Warri, a vibrant city in Delta State, is known for its dynamic atmosphere, oil and gas industry, and multicultural heritage. It offers a blend of commerce and culture along the coast.",
      image:
        "https://facts.net/wp-content/uploads/2023/07/35-facts-about-warri-1689845041.jpeg", // Provide the image path
      facts: [
        "The city hosts the Effurun Roundabout, known for its iconic sculpture.",
        "Warri's Pessu Market is a bustling hub for trading, selling a variety of goods.",
        "The city is known for its Pidgin English, widely spoken by residents.",
        "It's home to the Warri Kingdom, with its own unique culture and traditions.",
        "Local cuisine features dishes like Banga soup and starch.",
      ],
      destinations: [
        "The Red Mangrove Swamp for an ecological adventure.",
        "Olu's Palace for a cultural and historical experience.",
        "Pessu Market for shopping and local products.",
        "Koko Fishing Port for a glimpse of the fishing industry.",
        "Dining at local eateries for authentic Warri cuisine.",
      ],
    },
  ];


  const fetchListings = async () => {
    setListingLoading(true);
    await axios
      .get(token ? `/hosthomesForAuthUser?per_page=${per_page}` : `/hosthomesForUnAuthUser?per_page=${per_page}`)
      .then((response) => {
        console.log("homeList", response.data.data);
        const formattedHostHomes = response.data.data.map((item) => ({
          id: item.id,
          pictures: item.hosthomephotos,
          location: item.address,
          price: `₦${item.price} per night`,
          date: item.created_on,
          title: item.title,
          rating: item.ratings,
          link: "/ListingInfoMain",
          isFavorite: item.addedToWishlist,
        }));

        setListingType("NoFilter");
        setCurrent_page(response.data.meta.current_page);
        setLast_page(response.data.meta.last_page);
        setListings(formattedHostHomes);
        console.log("HMMM", response);

      })
      .catch((err) => {
        console.log("Listing", err);
      })
      .finally(() => setListingLoading(false));


  }

  const filterData = async (data, close) => {
    setListingLoading(true);
    close();
    // data.priceRange[0]
    const main = {
      min_price: data.priceRange[0],
      max_price: data.priceRange[1],
      bedrooms: data.selectedRoom,
      beds: data.selectedBedroom,
      bathrooms: data.selectedBathroom,
      property_type: data.selectedTypes,
      amenities: data.selectedAmenities,
    };
    console.log(main);

    await axios
      .post(
        token ? "/filterHomepageForAuthUser" : "/filterHomepageForUnAuthUser",
        main
      )
      .then((response) => {
        const formattedHostHomes = response.data.data.map((item) => ({
          id: item.id,
          pictures: item.hosthomephotos,
          location: item.address,
          price: `₦${item.price} per night`,
          date: item.created_on,
          title: item.title,
          rating: item.ratings,
          link: "/ListingInfoMain",
          isFavorite: item.addedToWishlist,
        }));

        setListings(formattedHostHomes);
        console.log("filter", response.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setListingLoading(false));
  };

  const filterDataByDates = async (data) => {
    setListingLoading(true);
    const totalGuest = data.adults + data.infants + data.children;

    const main = {
      address: data.selectedOption ? data.selectedOption.value : "",
      start_date: data.checkInDate,
      end_date: data.checkOutDate,
      guests: totalGuest,
      allow_pets: data.pets > 0 ? "allow_pets" : "no_pets",
    };
    // console.log("Main", main);

    await axios
      .post(
        token
          ? "/filterHostHomesDatesForAuthUser"
          : "/filterHostHomesDatesForUnAuthUser",
        main
      )
      .then((response) => {
        console.log("Main 2", response.data);
        const formattedHostHomes = response.data.data.map((item) => ({
          id: item.id,
          pictures: item.hosthomephotos,
          location: item.address,
          price: `₦${item.price} per night`,
          date: item.created_on,
          title: item.title,
          rating: item.ratings,
          link: "/ListingInfoMain",
          isFavorite: item.addedToWishlist,
        }));

        setListings(formattedHostHomes);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setListingLoading(false));
  };

  const filterDataByCategories = async (data) => {
    setCategory(data);
    setListingLoading(true);

    await axios.get(token ? `/searchHomeByProperty_typeForAuthUser/${data}?per_page=${per_page}` : `/searchHomeByProperty_typeForUnAuthUser/${data}?per_page=${per_page}`).then(response => {
      const formattedHostHomes = response.data.data.map((item) => ({
        id: item.id,
        pictures: item.hosthomephotos,
        location: item.address,
        price: `₦${item.price} per night`,
        date: item.created_on,
        title: item.title,
        rating: item.ratings,
        link: "/ListingInfoMain",
        isFavorite: item.addedToWishlist,
      }));

      setListingType("FilterbyPropertTypes");
      setCurrent_page(response.data.meta.current_page);
      setLast_page(response.data.meta.last_page);
      setListings(formattedHostHomes);

    }).catch((error) => {
      console.log(error);
    }).finally(() => setListingLoading(false));

  };


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2, // Show 3 cards on larger screens
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 768, // Adjust the breakpoint value to target mobile devices
        settings: {
          slidesToShow: 1, // Show 1 card on mobile devices
        },
      },
      {
        breakpoint: 1050, // Adjust the breakpoint value to target mobile devices
        settings: {
          slidesToShow: 2, // Show 1 card on mobile devices
        },
      },
    ],
  };

  // Reviews

  useEffect(() => {
    if(user?.id){

      console.log("GET PENDING REVIEWS")

      axios.get("/getPendingReviews").then(response => {
  
        const formattedHostHomes = response.data.data.map((item) => ({
          id: item.id,
          location: item.address,
          title: item.title,
          bookingid: item.bookingid,
          userid: item.userid,
          hostid: item.hostid,
          hosthomeid: item.hosthomeid,
        }));
        setHouseDetails(formattedHostHomes);
        console.log("pendingReviews", response.data.data)
  
      }).catch(error => {
  
      });
    }

    
  }, [user]);

  useEffect(() => {

    if (houseDetails != null) {
      setIsRateHouseModalOpen(true);
    }

  }, [houseDetails]);

  console.log("houseDetails", houseDetails)

  const ReviewListing = async (data) => {

    const reviewData = {
      pendingreviewid: houseDetails[0].id,
      ratings: data.rating,
      bookingid: houseDetails[0].bookingid,
      title: houseDetails[0].title,
      host_id: houseDetails[0].hostid,
      comment: data.comment,
      user_id: houseDetails[0].userid,
      host_home_id: houseDetails[0].hosthomeid
    }

    console.table(reviewData);

    await axios.post(`/createReviews`, reviewData).then(respnse => {
      toast.success("Thank you for commenting!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });

    }).catch(error => {
      console.log("createReview", error)

    }).finally(() => { });

  }
  const deletePendingReview = async (id) => {

    await axios.delete(`/deleteHostPendingReviews/${id}`).then(response => {
      console.log("Deleted Pending Review Successfully", response.data)

    }).catch(error => {
      console.log("DeletePendingReview", error)
    });


  }


  // Logic For the Pagination {START}
  const showMoreListings = () => {
    console.log("perPage", per_page)
    setPerPage((prevPage) => prevPage + 10);


  }

  useEffect(() => {
    setShowMoreLoading(true);
    switch (listingType) {
      case "NoFilter":
        fetchListings().finally(() => setShowMoreLoading(false));
        break;
      case "FilterbyPropertTypes":
        
        filterDataByCategories(category).finally(() => setShowMoreLoading(false));
        break;
      default:
        setShowMoreLoading(false);
        fetchListings();
    }
    console.log("show", showMoreLoading);
    // setShowMoreLoading(false)

  }, [per_page]);



  //{END}





  return (
    <div>
      {loading ? (
        <div>
          <div className="h-screen flex justify-center items-center">
            <div className="containerrr">
              <div className="cube"></div>
            </div>

            <img src={Logo} className="h-20 absolute" alt="" />
          </div>
        </div>
      ) : (
        <>
          <Header />
          {/* <Hamburger /> */}

          <BottomNavigation />
          <div
            className={` md:w-2/5 mx-auto flex justify-center fixed z-[999] left-0 right-0 transition-all ${isSearchButtonFixed ? "top-0" : "mt-6"
              }`}
          >
            <div className="bg-orange-400 z-50 w-[90%] md:w-full flex items-center justify-between  py-3 px-5 rounded-full mt-6 text-white shadow-2xl">
              <button onClick={openModal} className="flex  items-center w-3/4">
                <div className="w-[20%]">
                  <img src={searchIcon} className="w-6" alt="" />
                </div>
                <div className="w-[100%] text-start">
                  <div className="">
                    <div className="text-base font-medium">Anywhere</div>
                    <div className=" text-[12px] flex">
                      <div className="">Any week</div>
                      <div className="mx-4">Add guests</div>
                    </div>
                  </div>
                </div>
              </button>
              <div>
                <FilterModal
                  search={filterData}
                  clearAll={() => {
                    fetchListings()
                  }}
                />
              </div>
            </div>

            <Modal
              isOpen={isModalOpen}
              onClose={closeModal}
              search={filterDataByDates}
            />
          </div>
          <div className="pageHeader"></div>
          <div className="storeFrontHomeage">
            <div>
              <link
                rel="preload"
                as="image"
                href={
                  "https://forever.travel-assets.com/flex/flexmanager/images/2022/12/09/Exterior-Cabin_Privacy_Wrigley_VRBO_APFT2__Vancouver__Therin_8256x3960.jpg?impolicy=fcrop&w=1040&h=580&q=mediumHigh"
                }
              />

              <div
                className="hero-pattern relative bg-cover bg-center md:h-[70vh] h-[100vh] "
                style={{ backgroundImage: `url(${homeImage})` }}
              >
                <div className="h-full flex flex-col justify-center items-center">
                  <h1 className="text-white md:text-6xl text-5xl lg:text-6xl p-4 text-center z-50">
                    {/* Unlock Comfort, Discover Adventure with Shrbo. */}{" "}
                    {homeTitle}
                  </h1>
                  <div className="z-50">
                    <p className="z-50 text-white  md:text-base text-center text-sm px-10">
                      {/* Welcome to Shrbo, where comfort meets adventure. Find your
                  perfect home away from home and embark on memorable journeys,
                  one stay at a time. */}{" "}
                      {homeSubTitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {/* <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. A, iste
            porro beatae asperiores sapiente dolorum dolor quod voluptatibus
            odit, numquam quasi illo doloremque harum aut rem eaque nesciunt,
            reiciendis nihil?
          </p> */}
            </div>

            <section className=" md:w-[80%] mx-auto">
              <div className="justify-center flex">
                <CategoryHeader filter={filterDataByCategories} />
              </div>
              <section className="mx-auto justify-center w-[90%] md:w-[%]">

                <Listings user={user} homes={listings} loading={listingLoading} showMoreLoading={showMoreLoading} last_page={last_page} current_page={current_page} showMore={() => (showMoreListings())} />
                <div className="pb-48 w-[90%] mx-auto ">
                  <h1 className="text-center text-4xl mb-10">
                    Learn About the Major Cities
                  </h1>
                  <Slider {...settings}>
                    {cities.map((city, index) => (
                      <CityCard key={index} {...city} />
                    ))}
                  </Slider>
                </div>
              </section>
            </section>
            <RateHouseModal
              isOpen={isRateHouseModalOpen}
              onClose={closeRateHouseModal}
              houseDetails={houseDetails}
              review={(data) => { ReviewListing(data) }}
              type={true}
            />
          </div>
          <ChatSupport />
          <Footer />
        </>
      )}
    </div>
  );
}
