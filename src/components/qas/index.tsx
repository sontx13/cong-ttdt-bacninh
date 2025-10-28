import React from "react";
import { FunctionComponent, } from "react";
import { Box, Button, Text,  Icon } from "zmp-ui";
import { useNavigate } from 'react-router-dom';

interface QASItemProps {
  qas: any;
}

const QAS: FunctionComponent<QASItemProps> = ({ qas }) => {

  const navigate = useNavigate();
  const viewDetail = (id) => {
    navigate(`/qas-detail?id=${id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };


  const customStyle = {
    padding: '10px',
    borderRadius: '10px',
    width: '100%',
  };
  const titleColor = {
    color: '#1a6ab9',
    fontWeight: 'bold'
  };
  const fontWeight = {
    fontWeight: 'bold'
  };
  const checkflex = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };
  const success = {
    color: 'green',
    marginRight: '3px'
  };
  const primary = {
    marginRight: '3px'
  };
  const danger = {
    color: 'red',
    marginRight: '3px'
  };
  const lineHeight = {
    lineHeight: '2.0'
  }




  return (
    <Box
      flex
      justifyContent="space-between"
      alignItems="center"
      className="bg-white"
      onClick={() => viewDetail(qas.id)}
      style={lineHeight}
    >
      <div style={customStyle}>
        <div >
          <Icon icon="zi-user" size={20} /> {qas.name_q} 
        </div>
        <div >
          <Icon icon="zi-reminder" size={20} /> {formatDate(qas.time_q)}
        </div>
        {/* <div>
          {qas.active == 1 ? <>
            <Icon icon="zi-bookmark" size={20} />   Đã xử lý
          </> : qas.active == 0 ? <> <Icon icon="zi-bookmark" size={20} />   Chưa xử lý </> : <> <Icon icon="zi-bookmark" size={20} />   Đang xử lý </>}
        </div> */}

        {/* <div>
          <span style={fontWeight}><Icon icon="zi-help-circle" size={20} /> {qas.tieu_de}</span>
        </div> */}
        <div >
          <Icon icon="zi-help-circle" size={20} />  Câu hỏi:  <span  style={fontWeight}
            dangerouslySetInnerHTML={{
              __html: qas.content_q,
            }}
          />
        </div>

      </div>

    </Box>
  );
};

export default QAS;
