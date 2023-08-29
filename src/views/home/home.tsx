import { useEffect, useRef, useState } from "react"
import { Mountains, supabase } from "../../supabaseClient"
import { Button, List } from "antd"
import { useNavigate } from "react-router-dom"

import "./home.css"
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet"

export default function Root() {

    const [mountains, setMountains] = useState<Array<Mountains>>([])
    const [activeMountain, setActiveMountain] = useState<Mountains>()
    const [loading, setLoading] = useState<boolean>(false)
    const [user, setUser] = useState()
    const [routes, setRoutes] = useState({})
    const navigate = useNavigate();

    
    useEffect(() => {
        getMountains()

    }, [])

    //  Get Mountains
    async function getMountains(): Promise<void> {
        // Get Mountains with Route
        const { data: mnts } = await supabase.from("routes").select("mountain")
        let mountain_ids = [...new Set(mnts?.map(m => m.mountain))]
        const { data } = await supabase.from("mountains").select().in("id", mountain_ids)
        setMountains(data!);
    }
    async function chooseMountain(item: Mountains) {
        setLoading(true)
        setActiveMountain(item)
        // Fetch the routes
        // Get all routes
        const { data: route_id } = await supabase.from("routes").select(`
        id
        `).eq("mountain", item.id)
        let positions = {}
        let {data:routesInformation} = await supabase.from("routes").select(`*`)
        console.log(routesInformation)
        routesInformation = routesInformation.map((item)=>({[item.id]: item}))
        let routes = await Promise.all(route_id.map(async route => {
            const { data: waypoints } = await supabase.from("route2waypoint").select(`
                waypoints (lat, lon),
                index, 
                route
            `).eq("route", route.id)
            return {[route.id]: {
                route: routesInformation[route.id],
                waypoints: waypoints!.map(item => [...[item.waypoints.lat], ...[item.waypoints.lon]])}
            }
        }))
        setRoutes(routes.reduce((a,b)=>({...a,...b})))
        setLoading(false)
    }

    async function logout() {
        await supabase.auth.signOut()
        navigate("/login")
    }
    function SetViewOnClick({ coords }) {
        const map = useMap();
        map.setView(coords, map.getZoom());
        return null;
    }

    const MapWithPolyline = ({coordinates}) => {
        const map = useMap(); // Get access to the map instance
        const polylineRef = useRef();

        // Use useEffect to update the Polyline when coordinates change
        useEffect(() => {
            if (polylineRef.current) {
                polylineRef.current.setLatLngs(coordinates);
            }
        }, [coordinates]);

        return (
            <div>
                <Polyline ref={polylineRef} positions={coordinates} color="blue"/>
            </div>
        );
    };

    return (
        <div className="homeContainer">
            <div className="list">
                <List
                    header={<div>Header</div>}
                    footer={<div>Footer</div>}
                    bordered
                    dataSource={mountains}
                    renderItem={(item) => (
                        <List.Item onClick={() => chooseMountain(item)}>
                            {item.name} {item.height}m
                        </List.Item>
                    )}
                />
                <Button onClick={logout}>LogOut</Button>
            </div>
            <div className="map">
                {activeMountain ?
                    <MapContainer center={[activeMountain?.lat, activeMountain?.lon]} zoom={13} style={{ height: '500px', width: '100%' }}>
                        <SetViewOnClick
                            coords={[activeMountain?.lat, activeMountain?.lon]}></SetViewOnClick>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            // url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                            attribution='© OpenStreetMap-Mitwirkende, SRTM | Kartendarstellung: © OpenTopoMap (CC-BY-SA)'
                        />
                        {Object.values(routes).map((value, idx) => (
                              <MapWithPolyline key={idx} coordinates={value.waypoints} color="blue"/>
                        ))} 

                    </MapContainer> : "Chose a mountain"}
            </div>
        </div>
    )

}