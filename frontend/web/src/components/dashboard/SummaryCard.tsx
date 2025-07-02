// src/components/dashboard/SummaryCard.jsx
import React from 'react';
import { Card, Statistic } from 'antd';

const SummaryCard = ({ title, value, icon, iconColor }) => {
  return (
    <Card>
      <Statistic
        title={title}
        value={value}
        prefix={icon ? React.createElement(icon, { className: iconColor }) : null}
      />
    </Card>
  );
};

export default SummaryCard;