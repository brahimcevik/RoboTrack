import React from "react";
import { Card, Statistic } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

function Stats({ title, value, suffix }) {
  return (
    <Card bordered={false} style={{ backgroundColor: "white" }}>
      <Statistic
        title={title}
        value={value}
        precision={2}
        valueStyle={{
          color: "#white",
        }}
        prefix={<ArrowUpOutlined />}
        suffix={suffix}
      />
    </Card>
  );
}

export default Stats;
