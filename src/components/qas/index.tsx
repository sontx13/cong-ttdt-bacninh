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


  const customStyle: React.CSSProperties = {
    padding: '10px',
    borderRadius: '10px',
    width: '100%',
  };
  const titleColor: React.CSSProperties = {
    color: '#1a6ab9',
    fontWeight: 'bold'
  };
  const fontWeight: React.CSSProperties = {
    fontWeight: 'bold'
  };
  const checkflex: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };
  const success: React.CSSProperties = {
    color: 'green',
    marginRight: '3px'
  };
  const primary: React.CSSProperties = {
    marginRight: '3px'
  };
  const danger: React.CSSProperties = {
    color: 'red',
    marginRight: '3px'
  };
  const lineHeight: React.CSSProperties = {
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
          <Icon icon="zi-user" size={20} /> {qas.nameQ} 
        </div>
        <div >
          <Icon icon="zi-reminder" size={20} /> {formatDate(qas.timeQ)}
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
              __html: qas.contentQ,
            }}
          />
        </div>

      </div>

    </Box>
  );
};

export default QAS;
