import React from "react";
import { PageHeader, Button } from "antd";

const SurveysPage = () => {
  return (
    <PageHeader
      ghost={false}
      onBack={() => window.history.back()}
      title="Title"
      subTitle="This is a subtitle"
      extra={[
        <Button key="3">Operation</Button>,
        <Button key="2">Operation</Button>,
        <Button key="1" type="primary">
          Primary
        </Button>,
      ]}
    >
      <div className="site-layout-content">Content</div>
    </PageHeader>
  );
};

export default SurveysPage;
