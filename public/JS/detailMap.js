mapboxgl.accessToken = mapToken;//遞入自 detail.ejs
animalDeliver = JSON.parse(animalDeliver);//同上，並將字串解析為JSON對象

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: animalDeliver.geometry.coordinates,
    minZoom: 2,
    zoom: 7,
});

map.dragRotate.disable(); //禁止翻轉
map.touchZoomRotate.disableRotation();

new mapboxgl.Marker()
.setLngLat(animalDeliver.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25, calssName: 'popup'})
    .setHTML(
        `<strong class="fs-6 text-primary">${animalDeliver.title}</strong>
        <p class="text-muted">${animalDeliver.location}</p>`
    )
)
.addTo(map);

// mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js');
// map.addControl(new MapboxLanguage({
//     defaultLanguage: 'zh-Hans'
// }));