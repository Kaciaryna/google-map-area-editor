# google-map-area-editor

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

To save polygon geometry click it again after edit. 

After the map is being loaded all polygons are set on the map, but only part if them is made visible.
The box (region), containing all polygons is detected and is being divided into 25 parts (configurable).
Then the box for every polygon is calculated and polygons are assigned to the regions.
The visible regions are detected and only the polygons that belong to the visible regions are shown.

On user interactions (drag end and zoom change) the visible regions are recalculated and the polygons,
which belong to visible regions are set as visible.

The center of the map is set as a center of the box containing all polygons.
When the user hovers over the polygon it is being highlighted in white with black border and the
corresponding row in table on the right is highlighted. I show only first 25 entries in the table
(I think the pagination is needed).

When the user clicks on the polygon the polygon is being set editable and the corresponding entry in the table
is moved to the beginning of the list.

I think the map is rendering and rerendering is rather fast due to the optimization with dividing the map into regions.
That allows to narrow the recalculations needed for map redraw.

For the future improvements I would list:
* use polygons with simplified geometry to display map on higher zoom levels
* combine google.map.Polygons with data layers
* getting rid of vuex, which is happened to be very slow on big arrays (even for frozen and not associated with DOM nodes).
The state mutations took a lot of time that's why I got rid of most of them and moved them into
custom state without vuex.
