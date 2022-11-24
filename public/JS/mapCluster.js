mapboxgl.accessToken = mapToken;//遞入自detail.ejs
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [ 120.93874358912397, 23.92239934359359],
    zoom: 3
});

map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

map.on('load', () => {
    // 加載geoData資源，並設定集群
    map.addSource('geoData', {
        type: 'geojson',
        data: geoData,
        cluster: true,
        clusterMaxZoom: 14, 
        clusterRadius: 50
    });

    map.addLayer({ //集群圓
        id: 'clusters',
        type: 'circle',
        source: 'geoData',
        filter: ['has', 'point_count'],
        paint: {
            //設定顏色、半徑及其標準
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                10,
                '#3aba55',
                20,
                '#f28cb1'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                10,
                10,
                20,
                20,
                30
            ]
        }
    });

    map.addLayer({ //記數數字
        id: 'cluster-count',
        type: 'symbol',
        source: 'geoData',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    map.addLayer({  //獨立點
        id: 'unclustered-point',
        type: 'circle',
        source: 'geoData',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#51bbd6',
            'circle-radius': 5,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });

    //集群點擊聚焦事件
    map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('geoData').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
                if (err) return;

                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
    });

    //集群點擊彈窗事件
    map.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features[0].properties;

        const text = ` 
        <div class="card">
            <div class="outer">
                <div class="img">
                    <img src=${properties.url} alt="">
                </div>
                <div class="content">
                    <div class="card-body">
                        <div class="card-title title">${properties.title}</div>
                        <div class="card-text location">
                            <span class="text-muted">${properties.location}</span>
                        </div>
                        <div class="description">
                            <p class="card-text">${properties.description.substring(0, 20)}...</p>
                        </div>
                        <a href="animals/${properties.id}" class="btn btn-primary">查看更多</a>
                    </div>
                </div>
            </div>
        </div>`; 

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        const pop = new mapboxgl.Popup({offset: 0, closeButton: false, className:'popcard'})
            .setLngLat(coordinates)
            .setHTML(text)
            .addTo(map);
    });

    map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
    });
});