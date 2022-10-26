import React from "react";
import { Link } from "react-router-dom";
import { Space, Table, Skeleton } from "antd";

import Address from "../components/Address";

const SurveyList = ({ surveyData, isLoading, mainnetProvider, blockExplorer }) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Mode",
      dataIndex: "mode",
      key: "surveyMode",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Expire At",
      dataIndex: "expireAt",
      key: "expireAt",
    },
    {
      title: "Pollsters",
      key: "pollsters",
      dataIndex: "pollsters",
      render: (_, { pollsters }) => {
        pollsters.map(address => {
          return <Address value={address} minimized ensProvider={mainnetProvider} blockExplorer={blockExplorer} />;
        });
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/surveys/${record.id}/results`}>View Results</Link>
        </Space>
      ),
    },
  ];
  return isLoading ? <Skeleton active /> : <Table columns={columns} dataSource={surveyData} />;
};

export default SurveyList;
