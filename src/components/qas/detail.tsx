import React, { useEffect, useState } from "react";
import { Box, Text,  Page, Icon,  useNavigate,  Sheet, Header } from "zmp-ui";

import { useRecoilValue } from "recoil";
import { userState } from "../../state";
import { BASE_API, getQASById, urlFile } from "api";


const QASDetail = () => {

  const [qas, setQAS] = useState<any>({});
  const [popupVisible, setPopupVisible] = useState(false);


  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const idFromUrl = searchParams.get('id');
  
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_API}/${getQASById}/${idFromUrl}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        const data = jsonData.data;
        setQAS(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  const boxTitle: React.CSSProperties = {
    fontSize: '18px',
    textAlign: 'center',
    lineHeight: '1.1',
    fontWeight: 'bold',
  }
  const boxTit: React.CSSProperties = {
    backgroundColor: 'rgb(248 251 234)',
    borderRadius: '10px',
    border: '1px solid grey'
  }
  const boxContent: React.CSSProperties = {
    borderRadius: '10px',
    padding: '5px 15px',
    textAlign: 'justify',
  }
  var link = `#`
  if (qas.url_tai_lieu) {
    link = `${urlFile}/${qas.url_tai_lieu}`
  }

  const colorBlue: React.CSSProperties = {
    color: '#1c6cb3',
    fontWeight: 'bold'
  }
  const fontWeight: React.CSSProperties = {
    fontWeight: 'bold'
  }
  const line: React.CSSProperties = {
    width: '100%',
    height: '1px',
    background: '#dfdfdf'
  }

  return (
    <Page className="min-h-0 bg-white">
      <Header title='Chi tiết hỏi đáp'/>
      <Box mx={4} my={4}>
        <div style={boxContent}>
          {/* <p>  <Icon icon="zi-help-circle" size={20} />  Vấn đề PAKN: <span style={colorBlue}>{qas.tieu_de}</span></p> */}
          <p> <Icon icon="zi-user" size={20} />   Người gửi: <span >{qas.nameQ}</span></p>
          {/* <p> <Icon icon="zi-filter" size={20} />  {qas.dia_chi}</p> */}
          <p>  <Icon icon="zi-help-circle" size={20} />  Câu hỏi: <span  style={fontWeight}
            dangerouslySetInnerHTML={{
              __html: qas.contentQ,
            }}
          /></p>
          {/* {qas.url_tai_lieu != null ? <> <p>Danh sách file đính kèm: <span><a style={colorBlue} onClick={() => {
            setPopupVisible(true)
          }}>Xem</a></span></p></> : <> </>} */}
        </div>
        {qas.contentA == null || qas.contentA == "" ? <></> : <>
          <p style={line}></p>
          <div style={boxContent}>
            <p>  <Icon icon="zi-check" size={20} />  Trả lời: <span style={colorBlue}>   <span
              dangerouslySetInnerHTML={{
                __html: qas.contentA,
              }}
            /> </span></p>
          </div></>}




        <Sheet
          visible={popupVisible}
          onClose={() => setPopupVisible(false)}
          autoHeight
          mask
          handler
          swipeToClose
        >
          <div>
            <img
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              role='presentation'
              src={link}
              alt={link}
            />
          </div>
        </Sheet>
      </Box>
    </Page>

  );
};
export default QASDetail;
