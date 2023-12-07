'use client';
import { useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';

import axios from 'axios';
import moment from 'moment';
import "moment/min/locales";
import './i18n';
import { useTranslation } from 'react-i18next';

// moment.locale("en");

const myTheme = createTheme({
  typography: {
    fontFamily: ["Kufam"]
  }
})

let cancelAxios = null;
// const dateAndTime = moment().format('MMMM Do YYYY, h:mm:ss a');

export default function Home() {

  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: "",
  });

  const [locale, setLocale] = useState("en");

  const direction = locale == "en" ? "ltr" : "rtl";

  function handleTranslation () {
    if(locale == "en"){
      i18n.changeLanguage("ar");
      moment.locale("ar");
      setLocale("ar");
    } else {
      i18n.changeLanguage("en");
      moment.locale("en");
      setLocale("en");
    }

    setDateTime(moment().format('MMMM Do YYYY, h:mm:ss a'));
  }

  const [dateTime, setDateTime] = useState("");

  const { t, i18n } = useTranslation();

  useEffect(() => {
    // i18n.changeLanguage("en");
    setDateTime(moment().format('MMMM Do YYYY, h:mm:ss a'));

    axios
      .get("https://api.openweathermap.org/data/2.5/weather?lat=30.9762&lon=30.0492&appid=c056021235b2ced01f4365ea3d6334c5", {
        cancelToken: new axios.CancelToken((c) => {
          cancelAxios = c;
        })
      })
      .then(function (response) {
        const responseTemp = Math.round(response.data.main.temp - 272.15);
        const min = Math.round(response.data.main.temp_min - 272.15);
        const max = Math.round(response.data.main.temp_max - 272.15);
        const desc = response.data.weather[0].description;
        const icon = response.data.weather[0].icon;
        // console.log(responseTemp);
        setTemp({
          number: responseTemp,
          description: desc,
          min: min,
          max: max,
          icon: `https://openweathermap.org/img/wn/${icon}@2x.png`,
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    // Cleanup
    return () => {
      // console.log("Canceled");
      cancelAxios();
    }
  }, []);

  return (
    <ThemeProvider theme={myTheme}>
      <Container maxWidth="sm">
        <div style={{height:"100vh", display:"flex", flexDirection:"column", alignContent:"center", justifyContent:"center"}}>

          {/* Card */}
          <div dir={direction} style={{background:"rgba(0,0,0,0.3)", borderRadius:"15px", padding:"20px", color:"white", width:"100%", boxShadow:"0px 11px 5px rgba(0,0,0,0.15)"}}>

            {/* Contents */}
            <div style={{display:"flex", flexDirection:"column"}}>

              {/* City & Date */}
              <div style={{display:"flex", alignItems:"end", paddingBottom:"20px"}}>
                <Typography variant="h2">
                  {t("Sheikh Zayed")}
                </Typography>
                <Typography variant="h6" style={{fontSize:"14px", marginRight:"15px"}}>
                  {dateTime}
                </Typography>
              </div>
              {/* End City & Date */}

              <hr />

              {/* Container of degree + description */}
              <div style={{display:"flex", justifyContent:"space-around", paddingTop:"20px"}}>

                {/* Degree & Description */}
                <div>

                  {/* Temp. */}
                  <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                    <Typography variant="h1">
                      {temp.number}
                    </Typography>

                    <img src={temp.icon} alt="weather icon" />
                  </div>
                  {/* End Temp. */}

                  <Typography variant="h6" style={{marginRight:"15px"}}>
                    {t(temp.description)}
                  </Typography>

                  {/* Min & Max */}
                  <div style={{display:"flex", justifyContent:"space-between"}}>
                    <h5>{t("min")}: {temp.min}</h5>
                    <h5> | </h5>
                    <h5>{t("max")}: {temp.max}</h5>
                  </div>
                  {/* End Min & Max */}

                </div>
                {/* End Degree & Description */}

                <FilterDramaIcon style={{fontSize:"200px"}} />
              </div>
              {/* Container of degree + description */}

            </div>
            {/* End Contents */}

          </div>
          {/* End Card */}

          <div dir={direction} style={{marginTop:"10px"}}>
            <Button variant="text" onClick={handleTranslation}>{locale == "ar" ? "إنجليزى" : "Arabic"}</Button>
          </div>

        </div>
      </Container>
    </ThemeProvider>
  )
}
