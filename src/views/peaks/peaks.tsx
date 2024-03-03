import { useEffect, useMemo, useRef, useState } from "react"
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet"
import { Mountain, Route, WayPoint } from "../../supabaseClient"
import {
  CapsuleTabs,
  Ellipsis,
  FloatingPanel,
  NavBar,
  Popup,
  restoreMotion,
} from "antd-mobile"

import { AutoSizer, List as VirtualList } from "react-virtualized"
import "./peaks.css"
import {
  iconMountain,
  iconMountainUnmarked,
} from "../../components/icons/mountain.icon"
import MarkerClusterGroup from "@changey/react-leaflet-markercluster"
import { useDispatch, useSelector } from "react-redux"
import {
  MountainFilterTypes,
  addFilter,
  filter,
  filterRoutes,
  getFilteredMountains,
  getFilters,
  getMountainsInArea,
  loadMountainsById,
  removeAllFilter,
  removeFilter,
} from "../../app/mountainSlice"
import { Button, Input, List, Space, Tag } from "antd"
import { getRegions } from "../../app/regionSlice"
import FilterPanel from "../../components/filter-panel/filter-panel.component"
import MountainListElement from "../../components/mountain-list-element/mountain-list-element.component"
import { getRoutes, loadingRoutesByMountain } from "../../app/routesSlice"

const difficultyColors = {
  1: "green",
  2: "green",
  3: "blue",
  4: "orange",
  5: "red",
  6: "black",
}

export default function Peaks() {
  const [activeMountain, setActiveMountain] = useState<Mountain>()
  const [activeRoute, setActiveRoute] = useState<{
    route: Route
    waypoints: WayPoint[]
  }>()
  const [activeMountainIndex, setActiveMountainIndex] = useState<number>()
  const [previewedImage, setPreviewImage] = useState<string>()
  const [showFilterPane, setShowFilterPane] = useState<boolean>(false)
  const [isDraggable, setDraggable] = useState<boolean>(true)

  const map = useRef()
  const virtualMountainList = useRef()
  const floating = useRef()
  const mountains = useSelector(getFilteredMountains)
  const regions = useSelector(getRegions)

  const routes = useSelector(getRoutes)
  const test = useSelector(getFilters)

  const sortedMountainKeys = useMemo(() => {
    return Object.keys(mountains).sort()
  }, [mountains])

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadMountainsById())
  }, [])

  function chooseMountain(mountain) {
    const oldIndex = activeMountainIndex
    if (activeMountain && activeMountain.mountain_id == mountain.id) {
      resetChoices()
      virtualMountainList?.current?.recomputeRowHeights(oldIndex)
      return
    }
    dispatch(loadingRoutesByMountain(mountain.mountain_id))
    map?.current?.setView([mountain.lat, mountain.lon])
    activateMountain(mountain)
    const mtIdx = mountains.findIndex(
      (el) => el.mountain_id == mountain.mountain_id,
    )
    setActiveMountainIndex(mtIdx)
    virtualMountainList?.current?.scrollToRow(mtIdx)
    virtualMountainList?.current?.recomputeRowHeights(mtIdx)

    virtualMountainList?.current?.recomputeRowHeights(oldIndex)
    // floating?.current?.setHeight(window.innerHeight * 0.5)
    if (map?.current.getZoom() < 15) {
      map?.current?.setZoom(15)
      map?.current?.setView([mountain.lat, mountain.lon])
    }
  }
  const loadPeaksInView = () => {
    const bounds = map?.current?.getBounds()
    if (bounds === undefined) {
      return
    }
    dispatch(
      getMountainsInArea({
        north: bounds.getNorth(),
        east: bounds.getEast(),
        south: bounds.getSouth(),
        west: bounds.getWest(),
      }),
    )
  }

  const activateMountain = (mountain: Mountain) => {
    setActiveRoute(undefined)
    setActiveMountain(mountain)
  }

  const MapWithPolyline = ({
    coordinates,
    route,
    width,
    color,
    onMouseOver,
    onMouseOut,
    onClick,
  }) => {
    const map = useMap() // Get access to the map instance
    const polylineRef = useRef()

    // Use useEffect to update the Polyline when coordinates change
    useEffect(() => {
      if (polylineRef.current) {
        polylineRef.current.setLatLngs(coordinates)
      }
    }, [coordinates])

    let eventHandlers = {
      mouseover: (e) => {
        onMouseOver && onMouseOver(e.target.options.route)
      },
      mouseout: (e) => {
        onMouseOut && onMouseOut(e.target.options.route)
      },
      click: (e) => {
        onClick && onClick(e.target.options.route)
      },
    }
    return (
      <div>
        <Polyline
          ref={polylineRef}
          route={route}
          eventHandlers={eventHandlers}
          positions={coordinates}
          color={color}
          weight={width}
        />
      </div>
    )
  }

  const dispatchRouteFilter = (filter: MountainFilterTypes, value: any) => {
    dispatch(
      addFilter({
        type: filter,
        value: value,
      }),
    )
    dispatch(filterRoutes())
  }

  const resetChoices = () => {
    setActiveMountain(undefined)
    setActiveRoute(undefined)
    setActiveMountainIndex(undefined)
  }

  const anchors = [150, window.innerHeight * 0.4, window.innerHeight * 0.9]

  const rowRenderer = ({ key, index, style, isVisible }) => {
    let mt = mountains[index]

    // console.log(mt_index, index)
    return (
      <MountainListElement
        style={style}
        key={"table" + key + index}
        description={regions[mt.region ? mt.region : "a"]?.name || ""}
        mountain={mt}
        onClick={(mt: Mountain) => chooseMountain(mt)}
      />
    )
  }

  return (
    <div className="map-container">
      <Popup
        showCloseButton
        position="right"
        visible={showFilterPane}
        onMaskClick={() => {
          setShowFilterPane(false)
        }}
        onClose={() => {
          setShowFilterPane(false)
        }}
        bodyStyle={{ width: "100vw" }}
      >
        <div style={{ padding: "3em" }}>
          <FilterPanel></FilterPanel>
        </div>
      </Popup>

      <div className="mountain-overlay">
        <FloatingPanel
          anchors={anchors}
          ref={floating}
          handleDraggingOfContent={isDraggable}
        >
          <Space direction="horizontal">
            <Button onClick={() => setShowFilterPane(true)}>F</Button>
            <Button onClick={() => loadPeaksInView()}>P</Button>
            <Input
              onChange={(e) => {
                if (e.target.value.length === 0) {
                  dispatch(removeFilter(MountainFilterTypes.MOUNTAIN_NAME))
                  dispatch(loadMountainsById())
                }
                e.target.value.length > 3
                  ? dispatchRouteFilter(
                      MountainFilterTypes.MOUNTAIN_NAME,
                      e.target.value,
                    )
                  : ""
              }}
              enterButton="Search"
              placeholder="Gipfelnamen"
              allowClear
            ></Input>
          </Space>

          <CapsuleTabs
            defaultActiveKey="0"
            onChange={(key) => {
              resetChoices()
              switch (key) {
                case "0":
                  dispatch(removeFilter(MountainFilterTypes.HIKE_DIFFICULTY))
                  dispatch(filterRoutes())
                  break
                case "1":
                  dispatchRouteFilter(
                    MountainFilterTypes.HIKE_DIFFICULTY,
                    [1, 2],
                  )
                  break
                case "2":
                  dispatchRouteFilter(
                    MountainFilterTypes.HIKE_DIFFICULTY,
                    [3, 4],
                  )
                  break
                case "3":
                  dispatchRouteFilter(
                    MountainFilterTypes.HIKE_DIFFICULTY,
                    [5, 6],
                  )
                  break
              }
              dispatch(filterRoutes())
            }}
          >
            <CapsuleTabs.Tab title="Alle" key="0"></CapsuleTabs.Tab>
            <CapsuleTabs.Tab title="T1 - T2" key="1"></CapsuleTabs.Tab>
            <CapsuleTabs.Tab title="T3 - T4" key="2"></CapsuleTabs.Tab>
            <CapsuleTabs.Tab title="T5 - T6" key="3"></CapsuleTabs.Tab>
          </CapsuleTabs>

          {/* We dont have an active mountain!  */}
          {!activeMountain ? (
            <div>
              <AutoSizer>
                {({ height, width }) => {
                  return (
                    <VirtualList
                      scrollToAlignment="start"
                      ref={virtualMountainList}
                      width={width}
                      height={700}
                      onScroll={(e) => setDraggable(e.scrollTop === 0)}
                      rowCount={Object.values(mountains).length}
                      // rowHeight={100}
                      rowHeight={(idx: number) => {
                        return idx.index === activeMountainIndex ? 100 : 100
                      }}
                      rowRenderer={rowRenderer}
                    />
                  )
                }}
              </AutoSizer>
            </div>
          ) : (
            ""
          )}
          {/* We have an active mountain but no active route! */}
          {activeMountain && !activeRoute ? (
            <div>
              <NavBar onBack={() => resetChoices()}
                    backArrow={true}
                    right={(<Button href={"/planning?destination="+activeMountain.mountain_id} >New Route</Button>)}
                    >
                {activeMountain.mountain_name +
                  (activeMountain.height
                    ? ` (${activeMountain.height} m)`
                    : "")}
              </NavBar>
              <List
                style={{ padding: "1em" }}
                itemLayout="horizontal"
                dataSource={routes[activeMountain.mountain_id]}
                renderItem={(item: any, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <>
                          <Tag
                            color={difficultyColors[item.route.hike_difficulty]}
                          >
                            T{item.route.hike_difficulty}
                          </Tag>
                          <Tag>🤖</Tag>
                        </>
                      }
                      onClick={() => setActiveRoute(item)}
                      title={item.route.name}
                      description={
                        <Ellipsis
                          direction="start"
                          content={`via ${item.route.via}`}
                        />
                      }
                    />
                    <div>
                      <div> Length</div>
                      <div>{(item.route.length / 1000).toFixed(2)} km</div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          ) : (
            ""
          )}

          {/* We have an active mountain and an active route! */}
          {activeMountain && activeRoute ? (
            <div>
              <NavBar onBack={() => setActiveRoute(undefined)} backArrow={true}>
                {activeMountain.mountain_name +
                  (activeMountain.height
                    ? ` (${activeMountain.height} m)`
                    : "")}
              </NavBar>
              <div>
                {activeRoute.route.name}
                {activeRoute.waypoints.map((w) => w.waypoints.elevation + "\n")}
              </div>
            </div>
          ) : (
            ""
          )}
        </FloatingPanel>
      </div>
      {
        <MapContainer
          ref={map}
          center={[47.367541, 10.9218856]}
          onClick={() => resetChoices()}
          zoom={13}
          className="map markercluster-map"
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {activeMountain &&
            routes[activeMountain.mountain_id]?.map(({ route, waypoints }) => {
              return (
                <MapWithPolyline
                  key={route.id}
                  width={
                    activeRoute && activeRoute.route.id === route.id ? 10 : 5
                  }
                  color={difficultyColors[route.hike_difficulty]}
                  route={route}
                  onClick={(route) => setActiveRoute({ route, waypoints })}
                  coordinates={waypoints.map((w) => w.waypoints)}
                />
              )
            })}
          {activeMountain ? (
            <Marker
              key={activeMountain.mountain_id}
              icon={iconMountain}
              position={[activeMountain.lat, activeMountain.lon]}
              mountain={activeMountain.mountain_id}
              // We feed in the mountain for the handlers
              // mountain={m}
              eventHandlers={{
                click(e) {
                  chooseMountain(activeMountain)
                },
              }}
            ></Marker>
          ) : (
            ""
          )}
          <MarkerClusterGroup>
            {
              // Show the mountains
              mountains.map((m) => {
                return m.mountain_id !== activeMountain?.mountain_id ? (
                  <Marker
                    key={m.mountain_id}
                    icon={iconMountainUnmarked}
                    position={[m.lat, m.lon]}
                    mountain={m.mountain_id}
                    // We feed in the mountain for the handlers
                    // mountain={m}
                    eventHandlers={{
                      click(e) {
                        chooseMountain(m)
                      },
                    }}
                  ></Marker>
                ) : (
                  ""
                )
              })
            }
          </MarkerClusterGroup>
        </MapContainer>
      }
    </div>
  )
}
