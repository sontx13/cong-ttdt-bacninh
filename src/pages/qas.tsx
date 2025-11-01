import { BASE_API, getQAS, getQASById } from "api";
import QAS from "components/qas";
import React, { Suspense, useEffect, useState } from "react";
import { Page, Button, Box, useNavigate, Spinner, Input, Header } from "zmp-ui";
import { IQAS } from "types/qas";



const QASPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const viewDetail = () => {
    navigate(`/qas-create`);
  };
  const [qas, setQas] = useState<IQAS[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_API}/${getQAS}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        
        const data = jsonData.data;
        //console.log("data="+ data);
        setQas(jsonData.data?.result || []);
        //setQas(data); // Set fetched data to the state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

  }, []);
  const handleInput = (value) => {
    const keyword = value.target.value;
    if (keyword) {
      setLoading(true);
      const fetchQAS = async () => {
        try {
          const response = await fetch(`${BASE_API}/${getQAS}&contentQ=${keyword}`);
          if (!response.ok) throw new Error('Network response was not ok');
          const jsonData = await response.json();
          const data = jsonData.data;
          setQas(data?.result || []); // ✅ Luôn là mảng
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchQAS();
    }
  };

  const line = {
    width: '100%',
    height: '1px',
    background: '#dfdfdf'
  }
  const center = {
    display: 'flex',
    justifyContent: 'center'
  }
  const custombox = {
    height: '68%',
    overflow: 'auto'
  }
  return (
    <Page className="min-h-0 bg-white">
      <Header title="Hỏi đáp"  />
      <Box my={4} mx={4}>
        <Input.Search onChange={handleInput} />
      </Box>
      <Box my={4} mx={4} style={custombox}>
        {loading == true ? <>  <div
          style={center}
        >
          <Spinner visible={true} />
        </div></> : <>
          {Array.isArray(qas) && qas.map((item) => (
            <Box key={item.id} my={4}>
              <QAS qas={item} />
              <p style={line}></p>
            </Box>
          ))}
        </>}

      </Box>
      <Box my={4} mx={4}>
        <Button type="highlight" onClick={viewDetail} fullWidth size="large">
          Gửi câu hỏi
        </Button>
      </Box>


    </Page >
  );
};

export default QASPage;
