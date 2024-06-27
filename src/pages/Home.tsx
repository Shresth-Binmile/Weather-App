import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useCallback, useEffect, useMemo, useState } from "react";
import cities from '../data/cities.json'
import axios from "axios";
// import { memo } from "react";
import Button from "@mui/material/Button";


const Home = () => {

    const cachedCity = localStorage.getItem('cityName')
    const cachedLatitude = Number(localStorage.getItem("latitude"))
    const cachedLongitude = Number(localStorage.getItem("longitude"))
    const cachedMinTemp = localStorage.getItem('minTemp') || ''
    const cachedMaxTemp = localStorage.getItem('maxTemp') || ''

    console.log(cachedLatitude, cachedLongitude)

    const [index, setIndex] = useState<number | undefined>(undefined)
    const [city, setCity] = useState<number | undefined>(undefined)
    const [minTemp, setMinTemp] = useState<number | undefined>(undefined)
    const [maxTemp, setMaxTemp] = useState<number | undefined>(undefined)
    const [latitudes, setLatitudes] = useState<number | undefined>(undefined)
    const [longitudes, setLongitudes] = useState<number | undefined>(undefined)
    const [timeOut, setTimeOut] = useState<boolean>(false)
    // const [submit, setSubmit] = useState(false)

    // useState(() => {
    //     const cachedCity = localStorage.getItem('cityName')
    //     setCity(0);
    // }, [])

    useEffect(() => {
        const fetchData = async () => {
            // try {
            const weatherData = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitudes}&longitude=${longitudes}&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=1`) || await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${cachedLatitude}&longitude=${cachedLongitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=1`)
            console.log(weatherData)

            const { data } = weatherData
            const { daily, latitude, longitude } = data
            const { temperature_2m_max, temperature_2m_min } = daily

            console.log(temperature_2m_max[0], temperature_2m_min[0])
            setMinTemp(temperature_2m_min[0])
            setMaxTemp(temperature_2m_max[0])

            console.log(latitude, longitude)
            localStorage.setItem("latitude", latitude)
            localStorage.setItem("longitude", longitude)
            localStorage.setItem('minTemp', String(temperature_2m_min[0]))
            localStorage.setItem('maxTemp', String(temperature_2m_max[0]))
            // } catch (e) {
            //     localStorage.setItem("latitude", `${latitudes}`)
            //     localStorage.setItem("longitude", `${longitudes}`)
            // }
            // setSubmit(false)
        }

        fetchData()
    }, [latitudes, longitudes, timeOut])

    let intervalId = setInterval(() => {
        // window.location.reload()
        setTimeOut(!timeOut)
    }, 600000)

    clearInterval(intervalId);


    // e: SelectChangeEvent<number>
    const handleSelect = () => {
        // if (submit) {
        const cityIndex = index
        setCity(cityIndex)
        setLatitudes(Number(cities[cityIndex!].lat))
        setLongitudes(Number(cities[cityIndex!].lng))
        localStorage.setItem('cityName', cities[cityIndex!].city)
        // }
    }


    const averageTemp = useMemo(() => {

        if (minTemp && maxTemp) {
            return (minTemp + maxTemp) / 2
        }

    }, [minTemp, maxTemp])

    const averageCacheTemp = useMemo(() => {

        if (cachedMaxTemp && cachedMinTemp) {
            return (Number(cachedMaxTemp) + Number(cachedMinTemp)) / 2
        }

    }, [minTemp, maxTemp])

    const handleDisplay = useCallback(({ minT, maxT, avgT, cityValue }: { minT: number, maxT: number, avgT: number, cityValue: number | string }) => {
        return (
            <Box textAlign={'center'}>
                <Typography m={2} variant="h4" component={'h4'} textAlign={'center'} fontWeight={'Bold'}>Results for {typeof cityValue === 'number' ? cities[cityValue]?.city : cityValue || ''}</Typography>

                {/* { */}
                    {/* // typeof lat === undefined || typeof lon === undefined ? (<></>) : */}
                    {/* //     ( */}
                            <>
                                {
                                    avgT ? 
                                    (
                                        <>
                                            <Typography m={2} fontStyle={'italic'}>Min. Temperature: {minT}°C</Typography>
                                            <Typography m={2} fontStyle={'italic'}>Max. Temperature: {maxT}°C</Typography>
                                            <Typography m={2} fontStyle={'italic'}>Avg. Temperature: {avgT}°C</Typography>
                                        </>
                                    ) : (<></>)
                                }
                            </>
                        {/* ) */}
                {/* } */}
            </Box>
        )
    }, [minTemp, maxTemp, cachedMinTemp, cachedMaxTemp])


    return (
        <Container maxWidth="sm" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography m={2} variant="h2" component="h1" textAlign={'center'} fontWeight={'Bold'}>
                Weather App
            </Typography>
            <Box sx={{ border: '1px solid lightblue', minWidth: 500, minHeight: 400 }}>

                <Box sx={{ minWidth: 200, textAlign: 'center', m: 4 }}>
                    <FormControl fullWidth>
                        <InputLabel id="City">Select City</InputLabel>
                        <Select
                            labelId="City"
                            id="City"
                            label={`${cities[city!]}` || cachedCity}
                            value={city}
                            onChange={(e) => setIndex(Number(e.target.value))}
                        >
                            {
                                cities.map((city, index) => (
                                    <MenuItem key={index} value={index}>{city.city}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <Button sx={{ mt: 4 }} variant="contained" onClick={handleSelect}>Submit</Button>
                </Box>

                {
                    city ?
                        (

                            // handleDisplay({minT: minTemp, maxT: maxTemp, avgT: averageTemp, cityValue: city})
                            <>
                                {
                                    handleDisplay({ minT: minTemp!, maxT: maxTemp!, avgT: averageTemp!, cityValue: city!})
                                }
                            </>


                        ) :
                        (
                            <>
                                {
                                    handleDisplay({ minT: Number(cachedMinTemp), maxT: Number(cachedMaxTemp), avgT: Number(averageCacheTemp), cityValue: cachedCity!})
                                }
                            </>
                        )
                }
            </Box>
        </Container>
    )
}

export default Home

// har 10 min. me re-render krwao ***(hogya)
// Button functionality add kro
// useCallback use kro
// types(g)