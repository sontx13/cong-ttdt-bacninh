import { BASE_URL } from "api";
import QAS from "components/qas";
import React, { Suspense, useEffect, useState } from "react";
import { Page, Button, Box, useNavigate, Spinner, Input, Header } from "zmp-ui";



const QASPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const viewDetail = () => {
    navigate(`/qas-create`);
  };
  const [pakn, setPakn] = useState<any>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/zalo/getListPAKN`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        const data = jsonData.data;
        setPakn(data); // Set fetched data to the state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

  }, []);
  const handleInput = (value) => {
    if (value.target.value) {
      setLoading(true)
      const fetchQAS = async () => {
        try {
          const response = await fetch(`${BASE_URL}/zalo/paknByKey?key=${value.target.value}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const jsonData = await response.json();
          const data = jsonData.data;
          setPakn(data);
          setLoading(false)
        } catch (error) {
          setLoading(false)
          console.error('Error fetching data:', error);
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
          {pakn.map((item) => (
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
