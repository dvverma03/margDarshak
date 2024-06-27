// export const Helper= async(originRef, destinationRef)=>{
//     const directionsService = new google.maps.DirectionsService();
//     const results = await directionsService.route({
//       origin: originRef,
//       destination: destinationRef,
//       travelMode: google.maps.TravelMode.DRIVING,
//     });
//     return {"result":results, "distance" :results.routes[0].legs[0].distance.text}
// }


// function App() {
//     const [waypoints, setWaypoints] = useState([]);
//     const [distance, setDistance] = useState("");
//     const [directionResponse, setDirectionResponse] = useState(null);
  
//     /** @type React.MutableRefObject<HTMLInputElement> */
//     const originRef = useRef();
//     /** @type React.MutableRefObject<HTMLInputElement> */
//     const destinationRef = useRef();
//     /** @type React.MutableRefObject<HTMLInputElement> */
//     const stopRef = useRef();
  
//     async function calculateRoute() {
//       console.log("current", originRef?.current?.value);
//       console.log("current", destinationRef?.current?.value);
//       if (
//         originRef?.current?.value === "" ||
//         destinationRef?.current?.value === ""
//       ) {
//         return;
//       }
//       if (waypoints.length === 0) {
//         if (waypoints == "") {
//           const result = Helper(
//             originRef?.current?.value,
//             destinationRef?.current?.value
//           );
//           console.log(result);
//         }
//       } else {
//         if (waypoints == "") {
//           const result1 = Helper(originRef?.current?.value, waypoints[0]);
//           console.log("result1", result1);
//           for (let i = 1; i < waypoints.length; i++) {
//             const result = Helper(waypoints[i - 1], waypoints[i]);
//             console.log("result", result);
//           }
//           const length = waypoints.length;
//           const result2 = Helper(
//             waypoints[length - 1],
//             destinationRef?.current?.value
//           );
//           console.log("result2", result2);
//         } else {
//           const result1 = Helper(originRef?.current?.value, waypoints[0]);
//           console.log("result1", result1);
//           for (let i = 1; i < waypoints.length; i++) {
//             const result = Helper(waypoints[i - 1], waypoints[i]);
//             console.log("result", result);
//           }
//           const length = waypoints.length;
//           const result2 = Helper(waypoints[length - 1], stopRef.current.value);
//           console.log("result2", result2);
//           const result3 = Helper(
//             stopRef.current.value,
//             destinationRef?.current?.value
//           );
//           console.log("result3", result3);
//         }
//       }    
//     }
  
//     const { isLoaded } = useJsApiLoader({
//       googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//       libraries: ["places"],
//     });
  
//     const handleAddStop = () => {
//       if (stopRef?.current?.value) {
//         setWaypoints([...waypoints, stopRef?.current?.value]);
//       }
//     };
  
//     if (!isLoaded) {
//       return <div>loading</div>;
//     }
  
//     return (
//       <div className="min-h-screen flex flex-col">
//         <div>
//           <img
//             className="w-[160px] h-[70px] mt-[10px] mb-[5px] ml-[10px]"
//             src={Logo}
//             alt=""
//           />
//         </div>
  
//         <div className="bg-[#F4F8FA] pb-16 ">
//           <h1 className="text-[16px] text-[#1B31A8] py-4 text-center mb-4">
//             Let's calculate <b>distance </b>from Google maps
//           </h1>
//           <div className="md:flex">
//             <div className=" md:w-1/2 md:px-[8%]">
//               <div className="md:flex">
//                 <div className="py-6 px-4 w-full md:max-w-xl">
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Origin
//                     </label>
//                     <div className="relative">
//                       <EnvironmentOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                       <Autocomplete>
//                         <input
//                           ref={originRef}
//                           type="text"
//                           placeholder="origin"
//                           className="w-full pl-10 mt-1 block md:w-[250px] h-[45px] border border-gray-300 rounded-md shadow-sm"
//                         />
//                       </Autocomplete>
//                     </div>
//                   </div>
//                   <div className="mb-4 mt-12">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Stop
//                     </label>
//                     <div className="relative">
//                       <EnvironmentOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                       <Autocomplete>
//                         <input
//                           ref={stopRef}
//                           type="text"
//                           placeholder="stop"
//                           className="w-full pl-10 mt-1 block md:w-[250px] h-[45px] border border-gray-300 rounded-md shadow-sm"
//                         />
//                       </Autocomplete>
//                     </div>
//                     <div className="ml-20 mt-[2px]" onClick={handleAddStop}>
//                       <span className="mr-[4px]">
//                         <PlusCircleOutlined />
//                       </span>
//                       Add another stop
//                     </div>
//                   </div>
//                   <div className="mb-4 mt-12">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Destination
//                     </label>
//                     <div className="relative">
//                       <EnvironmentOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                       <Autocomplete>
//                         <input
//                           ref={destinationRef}
//                           type="text"
//                           placeholder="destination"
//                           className="w-full pl-10 mt-1 block md:w-[250px] h-[45px] border border-gray-300 rounded-md shadow-sm"
//                         />
//                       </Autocomplete>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mb-4 md:mt-[160px] w-full flex">
//                   <div className="justify-center">
//                     <button
//                       onClick={calculateRoute}
//                       className="w-[140px] h-[55px] ml-8 bg-[#1B31A8] rounded-[32px] text-white"
//                     >
//                       Calculate
//                     </button>
//                   </div>
//                 </div>
//               </div>
//               <div className=" bg-white h-[80px] md:w-[100%] mb-8 flex justify-between mx-4 items-center border border-gray-300 rounded-md shadow-sm px-2">
//                 <div className="text-[22px]">Distance:</div>
//                 <div className="text-[30px] lh-[36px] font-bold text-[#0079FF]">
//                   {distance + 0} Km
//                 </div>
//               </div>
//               {originRef?.current?.value &&
//                 distance &&
//                 destinationRef?.current?.value && (
//                   <div>
//                     `The distance between ${originRef?.current?.value} and $
//                     {destinationRef?.current?.value} via the selected route is{" "}
//                     {distance} kms.`
//                   </div>
//                 )}
//             </div>
//             <div className="md:w-1/2 flex">
//               {/* google map box  */}
//               <div className="w-full mx-1 h-[300px] md:w-[80%] md:h-[600px] md:ml-20">
//                 <GoogleMap
//                   center={center}
//                   zoom={15}
//                   mapContainerStyle={{ width: "100%", height: "100%" }}
//                   options={{
//                     zoomControl: false,
//                     streetViewControl: false,
//                     mapTypeControl: false,
//                     fullscreenControl: false,
//                   }}
//                 >
//                   <Marker position={center} />
//                   {directionResponse && (
//                     <DirectionsRenderer directions={directionResponse} />
//                   )}
//                   {/* display marker and direction   */}
//                 </GoogleMap>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }