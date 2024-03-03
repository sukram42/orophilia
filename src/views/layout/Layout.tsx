
import { TabBar } from "antd-mobile"
import { Outlet, useNavigate } from "react-router-dom"


import {
    TravelOutline,
    UserOutline,
    UpCircleOutline
} from 'antd-mobile-icons'

import "./layout.css"

export function Layout() {
    const history = useNavigate()
    const setRouteActive = (value: string) => {
        history(value)
    }
    return (
        <div className="test">
            <div className="layoutContainer">
                <div className="content">
                    <Outlet />
                </div>
                <TabBar safeArea className="tabbar" onChange={value => setRouteActive(value)}>
                    <TabBar.Item key={"/"} title={"Peaks"} icon={<UpCircleOutline />} />
                    <TabBar.Item key={"planning"} title={"Regions"} icon={<UserOutline />} />
                    <TabBar.Item key={"login"} title={"Community"} icon={<TravelOutline />} />
                </TabBar>
            </div>
        </div>
    )
}