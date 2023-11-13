import { Button, Divider, Form, Slider } from "antd";
import { useSelector } from "react-redux";
import { getRegions } from "../../app/regionSlice";

export interface FilterPanelProps {

}

export default function FilterPanel(props: FilterPanelProps) {

    return (<Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={(vals) => console.log(vals)}
    >
        <Divider>Wanderschwierigkeit (SAC Skala)</Divider>
        <Form.Item>
            <Slider
                defaultValue={[0, 6]}
                min={1}
                max={6}
                step={1}
                range />
        </Form.Item>

        <Form.Item>
            <Button type="primary">Submit</Button>
        </Form.Item>
    </Form>)
}