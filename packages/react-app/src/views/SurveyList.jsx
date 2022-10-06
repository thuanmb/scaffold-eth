import React from "react";
import { Link } from "react-router-dom";
import { Space, Table, Skeleton } from "antd";

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
  // TODO: render the pollsters
  // {
  // title: 'Tags',
  // key: 'tags',
  // dataIndex: 'tags',
  // render: (_, { tags }) => (
  // {tags.map(tag => {
  // let color = tag.length > 5 ? 'geekblue' : 'green';
  // if (tag === 'loser') {
  // color = 'volcano';
  // }
  // return (
  // <Tag color={color} key={tag}>
  // {tag.toUpperCase()}
  // </Tag>
  // );
  // })}
  // </>
  // ),
  // },
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

const SurveyList = ({ surveyData, isLoading }) => {
  return isLoading ? <Skeleton active /> : <Table columns={columns} dataSource={surveyData} />;
};

export default SurveyList;
