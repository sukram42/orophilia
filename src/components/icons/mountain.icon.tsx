import L from 'leaflet';
import mountainIcon from "../../assets/mountain.png"
import unmarkedMountainIcon from "../../assets/mountain_not_marked.png"

const iconMountain = new L.Icon({
    iconUrl: mountainIcon,
    iconSize: new L.Point(25, 25),
    className: 'leaflet-div-icon'
});

const iconMountainUnmarked = new L.Icon({
    iconUrl: unmarkedMountainIcon,
    iconSize: new L.Point(25, 25),
    className: 'leaflet-div-icon'
});
export { iconMountain, iconMountainUnmarked };