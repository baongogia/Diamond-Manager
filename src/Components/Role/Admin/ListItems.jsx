import React from "react";

export default function ListItems() {
  const [details, setDetails] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setDetails(true)}
      onMouseLeave={() => setDetails(false)}
      className="relative w-[95%] mt-16 h-20 flex justify-center items-center bg-green-900 rounded-lg"
    >
      <div className="w-[98%] h-[90%] flex justify-around items-center">
        {/* Image */}
        <div
          style={{
            backgroundImage: `url('https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR3ylT9ZjrMyn6WeHhEc76pa_XWaIwNuMPuhgqna0zDIVXEOXLg26aglkgP2BmL0XWYJyruYIpP_KqZ6SzYB4_TfRvwJ2cDLhLGZvrJ-0NPE1zinWDlMUA&usqp=CAE')`,
          }}
          className="w-20 h-full rounded-xl bg-cover bg-center"
        ></div>
        {/* Infor */}
        <div className="w-2/3 h-full flex flex-col justify-center items-start">
          <div className="">1.52 Carat Loose H / VS2 Round Brilliant</div>
          <div className="">$16,264.00</div>
        </div>
        {/* Button */}
        <div className="flex justify-between w-1/5">
          <div className="bg-yellow-400 hover:bg-white hover:text-yellow-400 py-2 px-6 rounded-sm cursor-pointer transition-colors duration-500">
            Update
          </div>
          <div className="bg-red-400 py-2 px-6 hover:bg-white hover:text-red-400 rounded-sm cursor-pointer transition-colors duration-500">
            Delete
          </div>
        </div>
        {/* Details */}
        <div
          className={`fixed w-[85.2%] z-[-1] transition-all duration-500 ease-in-out ${
            details ? "translate-y-full" : ""
          } rounded-b-lg h-[9%] flex justify-center items-center bg-unit bg-opacity-30`}
        >
          <div className="w-[90%] flex justify-between items-start">
            <div className="flex">
              <div className="mr-2">
                <ion-icon name="sparkles-outline"></ion-icon>
              </div>
              <div className="">Carat: 1.52</div>
            </div>
            <div className="flex">
              <div className="mr-2">
                <ion-icon name="resize-outline"></ion-icon>
              </div>
              <div className="">Size: 17.5</div>
            </div>
            <div className="flex">
              <div className="mr-2">
                <ion-icon name="diamond-outline"></ion-icon>
              </div>
              <div className="">Material: Diamond</div>
            </div>
            <div className="flex">
              <div className="mr-2">
                <ion-icon name="water-outline"></ion-icon>
              </div>
              <div className="">Clarity: SI2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
