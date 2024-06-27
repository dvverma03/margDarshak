import React, { useRef, useState } from "react";
import "./App.css";
import Logo from "./images/logo.png";
import { PlusCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

const center = { lat: 25.3176, lng: 82.9739 };

const Helper = async (origin, destination, google) => {
  const directionsService = new google.maps.DirectionsService();
  const results = await directionsService.route({
    origin: origin,
    destination: destination,
    travelMode: google.maps.TravelMode.DRIVING,
  });
  return { "result": results, "distance": results.routes[0].legs[0].distance.text };
};

let totalDistance=0

function App() {
  const [waypoints, setWaypoints] = useState([]);
  const [distance, setDistance] = useState("");
  const [directionResponse, setDirectionResponse] = useState([]);

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const stopRef = useRef();

  const { isLoaded, loadError, google } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  async function calculateRoute() {
    if (!originRef.current.value || !destinationRef.current.value) {
      return;
    }

    if (waypoints.length === 0) {
      const result = await Helper(
        originRef.current.value,
        destinationRef.current.value,
        google
      );
      totalDistance=totalDistance+result?.routes[0]?.legs[0]?.duration.text
      setDirectionResponse(prevWaypoints => {
        const newWaypoints = [...prevWaypoints, result];
        console.log("Updated waypoints:", newWaypoints);
        return newWaypoints;
      });
    } else {
      const firstLeg = await Helper(originRef.current.value, waypoints[0], google);
      totalDistance=totalDistance+firstLeg?.routes[0]?.legs[0]?.duration.text
      setDirectionResponse(prevWaypoints => {
        const newWaypoints = [...prevWaypoints, firstLeg];
        console.log("Updated waypoints:", newWaypoints);
        return newWaypoints;
      });

      for (let i = 1; i < waypoints.length; i++) {
        const legResult = await Helper(waypoints[i - 1], waypoints[i], google);
        totalDistance=totalDistance+legResult?.routes[0]?.legs[0]?.duration.text
        setDirectionResponse(prevWaypoints => {
          const newWaypoints = [...prevWaypoints, legResult];
          return newWaypoints;
        });
      }

      const lastLeg = await Helper(waypoints[waypoints.length - 1], destinationRef.current.value, google);
      totalDistance=totalDistance+lastLeg?.routes[0]?.legs[0]?.duration.text
      setDirectionResponse(prevWaypoints => {
        const newWaypoints = [...prevWaypoints, lastLeg];
        return newWaypoints;
      });

      if (stopRef.current.value) {
        const stopLeg = await Helper(waypoints[waypoints.length - 1], stopRef.current.value, google);
        totalDistance=totalDistance+stopLeg?.routes[0]?.legs[0]?.duration.text
        setDirectionResponse(prevWaypoints => {
          const newWaypoints = [...prevWaypoints, stopLeg];
          return newWaypoints;
        });
        console.log("result2", stopLeg);
        const finalLeg = await Helper(stopLeg, destinationRef.current.value, google);
        totalDistance=totalDistance+finalLeg?.routes[0]?.legs[0]?.duration.text
        setDirectionResponse(prevWaypoints => {
          const newWaypoints = [...prevWaypoints, finalLeg];
          return newWaypoints;
        });
      }
    }
  }

  const handleAddStop = () => {
    if (stopRef?.current?.value) {
      const newWaypoints= [...waypoints, stopRef?.current?.value]
      setWaypoints(newWaypoints)
      console.log(waypoints)
      stopRef.current.value = "";
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div>
        <img
          className="w-[160px] h-[70px] mt-[10px] mb-[5px] ml-[10px]"
          src={Logo}
          alt=""
        />
      </div>

      <div className="bg-[#F4F8FA] pb-16">
        <h1 className="text-[16px] text-[#1B31A8] py-4 text-center mb-4">
          Let's calculate <b>distance </b>from Google maps
        </h1>
        <div className="md:flex">
          <div className="md:w-1/2 md:px-[8%]">
            <div className="md:flex">
              <div className="py-6 px-4 w-full md:max-w-xl">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Origin
                  </label>
                  <div className="relative">
                    <EnvironmentOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Autocomplete>
                      <input
                        ref={originRef}
                        type="text"
                        placeholder="origin"
                        className="w-full pl-10 mt-1 block md:w-[250px] h-[45px] border border-gray-300 rounded-md shadow-sm"
                      />
                    </Autocomplete>
                  </div>
                </div>
                <div className="mb-4 mt-12">
                  <label className="block text-sm font-medium text-gray-700">
                    Stop
                  </label>
                  <div className="relative">
                    <EnvironmentOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Autocomplete>
                      <input
                        ref={stopRef}
                        type="text"
                        placeholder="stop"
                        className="w-full pl-10 mt-1 block md:w-[250px] h-[45px] border border-gray-300 rounded-md shadow-sm"
                      />
                    </Autocomplete>
                  </div>
                  <div className="ml-20 mt-[2px] cursor-pointer" onClick={handleAddStop}>
                    <span className="mr-[4px]">
                      <PlusCircleOutlined />
                    </span>
                    Add another stop
                  </div>
                  <div>
                    {waypoints.length > 0 && (
                      waypoints.map((e, index) => <div className="border border-gray-300 rounded-md shadow-sm bg-white my-1 py-2 pl-2" key={index}>{e}</div>)
                    )}
                  </div>
                </div>
                <div className="mb-4 mt-12">
                  <label className="block text-sm font-medium text-gray-700">
                    Destination
                  </label>
                  <div className="relative">
                    <EnvironmentOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Autocomplete>
                      <input
                        ref={destinationRef}
                        type="text"
                        placeholder="destination"
                        className="w-full pl-10 mt-1 block md:w-[250px] h-[45px] border border-gray-300 rounded-md shadow-sm"
                      />
                    </Autocomplete>
                  </div>
                </div>
              </div>
              <div className="mb-4 md:mt-[160px] w-full flex">
                <div className="justify-center">
                  <button
                    onClick={calculateRoute}
                    className="w-[140px] h-[55px] ml-8 bg-[#1B31A8] rounded-[32px] text-white"
                  >
                    Calculate
                  </button>
                </div>
              </div>
            </div>
            <div className=" bg-white h-[80px] md:w-[100%] mb-8 flex justify-between mx-4 items-center border border-gray-300 rounded-md shadow-sm px-2">
              <div className="text-[22px]">Distance:</div>
              <div className="text-[30px] lh-[36px] font-bold text-[#0079FF]">
                {totalDistance}Km
              </div>
            </div>
            {originRef.current?.value &&
              distance &&
              destinationRef.current?.value && (
                <div>
                  The distance between {originRef.current.value} and {destinationRef.current.value} via the selected route is {distance} kms.
                </div>
              )}
          </div>
          <div className="md:w-1/2 flex">
            {/* google map box  */}
            <div className="w-full mx-1 h-[300px] md:w-[80%] md:h-[600px] md:ml-20">
              <GoogleMap
                center={center}
                zoom={15}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                options={{
                  zoomControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
              >
                <Marker position={center} />
                {directionResponse && (
                  directionResponse.map((result)=>(
                    <DirectionsRenderer directions={result} />
                  ))
                )}
                {/* display marker and direction   */}
              </GoogleMap>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
