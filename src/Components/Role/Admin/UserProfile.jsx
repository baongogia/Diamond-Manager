import React from "react";
import { PropagateLoader } from "react-spinners";

export default function UserProfile({ role }) {
  return (
    <div className="absolute right-0 top-0 w-[36vw] flex justify-center items-center h-full">
      <div className="w-[90%] h-[95%] flex justify-center items-center bg-main rounded-2xl">
        <div className="w-[90%] h-[95%]">
          {/* Icons */}
          <div className="flex justify-between items-center h-10">
            <div className="">
              <ion-icon size="large" name="reorder-three-outline"></ion-icon>
            </div>

            <div className="text-[1.3em] h-8 w-1/2 flex justify-between items-center">
              <ion-icon name="share-outline"></ion-icon>
              <ion-icon name="qr-code-outline"></ion-icon>
              <ion-icon name="shield-checkmark-outline"></ion-icon>
              <div
                style={{
                  backgroundImage: `url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL3Jhd3BpeGVsX29mZmljZV8yNl9pbGx1c3RyYXRpb25fYXVyb3JhX2dyZWVuX3dpdGhfc3BhcmtsZV9sYW5kc181YjA0NzRiZi0zM2Q1LTQ5MWItODBlZi1kMWExMWFjOWVjYjFfMS5qcGc.jpg')`,
                }}
                className="w-10 h-10 rounded-full bg-cover bg-center"
              ></div>
            </div>
          </div>
          {/* Profile */}
          <div className="w-full h-[29vh] mt-8 flex flex-col justify-between items-center">
            <div className="w-[45%] h-[80%] border-dotted border-[0.3em] border-opacity-85 border-y-green-700 border-x-slate-600 rounded-full flex justify-center items-center">
              <div
                style={{
                  backgroundImage: `url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL3Jhd3BpeGVsX29mZmljZV8yNl9pbGx1c3RyYXRpb25fYXVyb3JhX2dyZWVuX3dpdGhfc3BhcmtsZV9sYW5kc181YjA0NzRiZi0zM2Q1LTQ5MWItODBlZi1kMWExMWFjOWVjYjFfMS5qcGc.jpg')`,
                }}
                className="w-[90%] h-[93%] rounded-full bg-cover bg-center"
              ></div>
            </div>
            <div className="">Mr.Bao</div>
          </div>
          {/* Information */}
          <div className="w-full h-[27vh] flex flex-col justify-between items-center mt-6 bg-box rounded-2xl">
            <div className="w-full h-1/2 mt-2 ml-6 flex flex-col justify-between items-start">
              <div className="">Email: Baotien123321@gmail.com</div>
              <div className="">Phone: 0934102678</div>
              <div className="">Address: Ho Chi Minh City</div>
            </div>
            <div className="w-[95%] h-1/6 flex bg-red-400 rounded-full justify-between items-center">
              <div className="indent-8">Role: {role}</div>
            </div>
            <div className="w-[95%] h-1/6 mb-2 flex bg-green-400 rounded-full justify-between items-center">
              <div className="indent-8">Status: Active</div>
            </div>
          </div>
          {/* Button */}
          <div className="w-full h-[12vh] flex justify-between items-center mt-6">
            <div className="w-[25%] h-full flex flex-col justify-center items-center rounded-xl border-white border-[0.1em] cursor-pointer hover:text-green-700 hover:border-green-700">
              <div className="">
                <ion-icon size="large" name="clipboard-outline"></ion-icon>
              </div>
              <div className="">Task</div>
            </div>
            <div className="w-[25%] h-full flex flex-col justify-center items-center rounded-xl border-white border-[0.1em] cursor-pointer hover:text-green-700 hover:border-green-700">
              <div className="">
                <ion-icon size="large" name="cellular-outline"></ion-icon>
              </div>
              <div className="">Chart</div>
            </div>
            <div className="w-[25%] h-full flex flex-col justify-center items-center rounded-xl border-white border-[0.1em] cursor-pointer hover:text-green-700 hover:border-green-700">
              <div className="">
                <ion-icon size="large" name="cloud-download-outline"></ion-icon>
              </div>
              <div className="">Data</div>
            </div>
          </div>
          {/* Animation */}
          <div className="w-full flex justify-center items-center h-[10vh]">
            <PropagateLoader color="#0f840f" />
          </div>
        </div>
      </div>
    </div>
  );
}
