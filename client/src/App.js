import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState({html:""});

  useEffect(() => {
    const fetchData = async () => {
      
      setData(res);
    };
    fetchData();
  }, []);

  console.log(data.html);

  return (
    <div>
      {data.html}
    </div>
  );
}

export default App;
