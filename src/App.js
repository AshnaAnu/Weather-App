import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoMdSunny, IoMdRainy, IoMdCloudy, IoMdSnow, IoMdThunderstorm, IoMdSearch } from 'react-icons/io';
import { BsCloudHaze2Fill, BsCloudDrizzleFill, BsEye, BsWater, BsThermometer, BsWind } from 'react-icons/bs';
import { TbTemperatureCelsius } from 'react-icons/tb';
import { ImSpinner8 } from 'react-icons/im';

const APIkey = '1c5691b8a7323e058a541ca6bddb53c8';

const App = () => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('London');
  const [inputvalue, setInputvalue] = useState('');
  const [animate, setAnimate] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [errorMsg, setErrormsg] = useState('');

  const handleInput = (e) => {
    setInputvalue(e.target.value);
  };

  const handleSubmit = (e) => {
    if (inputvalue !== '') {
      setLocation(inputvalue);
    }

    const input = document.querySelector('input');

    if (input.value === '') {
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 500);
    }

    input.value = '';
    e.preventDefault();
  };

  useEffect(() => {
    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIkey}`;

    axios
      .get(url)
      .then((res) => {
        setTimeout(() => {
          setData(res.data);
          setLoading(false);
        }, 1500);
      })
      .catch((err) => {
        setLoading(false);
        setErrormsg(err);
      });
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrormsg('');
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMsg]);

  if (!data) {
    return (
      <div className='w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col justify-center items-center'>
        <div>
          <ImSpinner8 className='text-5xl animate-spin text-white' />
        </div>
      </div>
    );
  }

  let icon;
  switch (data.weather[0].main) {
    case 'Clouds':
      icon = <IoMdCloudy />;
      break;
    case 'Haze':
      icon = <BsCloudHaze2Fill />;
      break;
    case 'Rain':
      icon = <IoMdRainy className='text-[#31cafb]' />;
      break;
    case 'Clear':
      icon = <IoMdSunny className='text-[#ffde33]' />;
      break;
    case 'Drizzle':
      icon = <BsCloudDrizzleFill className='text-[#31cafb]' />;
      break;
    case 'Snow':
      icon = <IoMdSnow className='text-[#31cafb]' />;
      break;
    case 'Thunderstorm':
      icon = <IoMdThunderstorm />;
      break;
    default:
      icon = <IoMdSunny />;
      break;
  }

  const date = new Date();

  return (
    <div className='w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0'>
      {errorMsg && (
        <div className='w-full max-w-[20vw] lg:max-w-[400px] text-dark absolute top-2 lg:top-10 p-4 capitalize rounded-md' style={{ marginTop: '20px' }}>
          {`${errorMsg.response.data.message}`}
        </div>
      )}

      <h1 className='text-2xl sm:text-3xl text-white font-bold mb-4 mt-4'>Weather App</h1>

      <form
        className={`${animate ? 'animate-shake' : 'animate-none'} h-14 sm:h-16 bg-black/30 w-full max-w-[400px] sm:max-w-[450px] rounded-full backdrop-blur-[32px] mb-6 sm:mb-8`}
      >
        <div className='h-full relative flex items-center justify-between p-2'>
          <input
            onChange={(e) => handleInput(e)}
            className='flex-1 bg-transparent outline-none placeholder:text-white text-white text-[14px] sm:text-[15px] font-light pl-4 sm:pl-6 h-full'
            type='text'
            placeholder='Search by city or country'
          />
          <button
            onClick={(e) => handleSubmit(e)}
            className='bg-[#add8e6] hover:bg-indigo-600 w-16 sm:w-20 h-10 sm:h-12 rounded-full flex justify-center items-center transition'
          >
            <IoMdSearch className='text-xl sm:text-2xl text-white' />
          </button>
        </div>
      </form>

      <div className='w-full max-w-[400px] sm:max-w-[450px] bg-black/20 min-h-[380px] sm:min-h-[400px] text-white backdrop-blur-[32px] rounded-[32px] py-8 sm:py-12 px-4 sm:px-6'>
        {Loading ? (
          <div className='w-full min-h-[380px] sm:min-h-[400px] flex justify-center items-center'>
            <ImSpinner8 className='text-white text-4xl sm:text-5xl animate-spin' />
          </div>
        ) : (
          <div>
            <div className='flex items-center gap-x-3 sm:gap-x-5'>
              <div className='text-[70px] sm:text-[87px]'>{icon}</div>
              <div className='text-xl sm:text-2xl font-semibold'>
                {data.name}, {data.sys.country}
              </div>
              {date.getUTCDate()}/{date.getUTCMonth() + 1}/{date.getUTCFullYear()}
            </div>

            <div className='my-8 sm:my-10'>
              <div className='flex justify-center items-center'>
                <div className='text-[100px] sm:text-[144px] leading-none font-light'>{parseInt(data.main.temp)}</div>
                <div className='text-3xl sm:text-4xl'>
                  <TbTemperatureCelsius />
                </div>
              </div>
              <div className='capitalize text-center'>{data.weather[0].description}</div>
            </div>

            <div className='max-w-[320px] sm:max-w-[378px] mx-auto flex flex-col gap-y-4 sm:gap-y-6'>
              <div className='flex justify-between'>
                <div className='flex items-center gap-x-1 sm:gap-x-2'>
                  <div className='text-[18px] sm:text-[20px]'>
                    <BsEye />
                  </div>
                  <div>
                    Visibility <span className='ml-1 sm:ml-2'>{data.visibility / 1000}Km</span>
                  </div>
                </div>
                <div className='flex items-center gap-x-1 sm:gap-x-2'>
                  <div className='text-[18px] sm:text-[20px]'>
                    <BsThermometer />
                  </div>
                  <div className='flex'>
                    Feels like <div className='flex ml-1 sm:ml-2'>{parseInt(data.main.feels_like)}</div>
                    <TbTemperatureCelsius />
                  </div>
                </div>
              </div>

              <div className='flex justify-between'>
                <div className='flex items-center gap-x-1 sm:gap-x-2'>
                  <div className='text-[18px] sm:text-[20px]'>
                    <BsWater />
                  </div>
                  <div>
                    Humidity <span className='ml-1 sm:ml-2'>{data.main.humidity}%</span>
                  </div>
                </div>
                <div className='flex items-center gap-x-1 sm:gap-x-2'>
                  <div className='text-[18px] sm:text-[20px]'>
                    <BsWind />
                  </div>
                  <div>
                    Wind <span className='ml-1 sm:ml-2'>{data.wind.speed}m/s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;



