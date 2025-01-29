import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "react-bootstrap";

const FeatureCard = ({ title, text, icon }) => {
  return (
    <Card className="text-center shadow-sm">
      <Card.Body>
        <FontAwesomeIcon icon={icon} size="3x" className="mb-3 text-primary" />
        <Card.Title>{title}</Card.Title>
        <Card.Text>{text}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default FeatureCard;
