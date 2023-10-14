
import { TabBar } from "antd-mobile"
import { Outlet } from "react-router-dom"

import {
    TravelOutline,
    UserOutline,
    UpCircleOutline
} from 'antd-mobile-icons'

import "./layout.css"

export function Layout() {
    return (
        <div>
            <div className="layoutContainer">
                <div className="content">
                <Outlet />
                </div>
                <TabBar safeArea className="tabbar">
                    <TabBar.Item key={"peaks"} title={"Peaks"} icon={<UpCircleOutline />} />
                    <TabBar.Item key={"region"} title={"Regions"} icon={<UserOutline />} />
                    <TabBar.Item key={"community"} title={"Community"} icon={<TravelOutline />} />
                </TabBar>
            </div>
        </div>
    )
}