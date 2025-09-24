import React, { useContext, useEffect, useState } from "react";
import { rooms } from "../assets/assests.js";
import RoomComponent from "./RoomComponent.jsx";
import Title from "./Title.jsx";
import { HotelContext } from "../context/HotelContext.jsx";

const BestSeller = () => {
  const [bestseller, setbestseller] = useState([]);
  const{Rooms} = useContext(HotelContext);

  useEffect(() => {
    const BestRooms = () => {
      const filterRooms = Rooms.filter(
        (item) =>
          item.isBestSeller && item.status === "available" && item.rating > 4.4
      );
      setbestseller(filterRooms);
    };
    BestRooms();
  }, [Rooms]);

  return (
    <div className="p-4 mt-10">
      {/* Centered Heading */}
      <Title title1={"Best"} title2={"Sellers"} />

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
        {bestseller.slice(0, 3).map((item) => (
          <RoomComponent key={item._id} room={item} />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
