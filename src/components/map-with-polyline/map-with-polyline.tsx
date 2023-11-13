import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

const MapWithPolyline = ({ coordinates, route, width }) => {
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
                <Polyline ref={polylineRef}
                    route={route}
                    eventHandlers={eventHandlers}
                    positions={coordinates}
                    color="blue"
                    weight={width}
                />
            </div>
        );
    };