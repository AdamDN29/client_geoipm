import L from 'leaflet';
import ImgAsset from '../../assets'

const icon_marker = new L.Icon({
    iconUrl: require('./icon_marker.svg'),
    iconRetinaUrl: require('./icon_marker.svg'),
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(60, 75),
    // className: 'leaflet-div-icon'
});

export { icon_marker };