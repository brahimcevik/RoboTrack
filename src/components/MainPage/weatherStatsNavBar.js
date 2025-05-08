import React, { useState, useContext, useEffect } from "react";
import { ReactComponent as Clear } from "../../img/sun.svg";
import { ReactComponent as Clouds } from "../../img/clouds.svg";
import { ReactComponent as Rain } from "../../img/rainy-2.svg";
import { BellIcon, SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import pp from "../../img/pp.jpg";
import Lottie from "lottie-react";
import Cloudy from "../../img/cloudy.json";
import sunny from "../../img/sunny.json";
import { Modal } from "antd";
import { ThemeContext } from "../../context/themeContenx";
import { useDispatch } from "react-redux";
import { setCoordinates, setCityCoordinates } from "../../redux/ugvCoordinatesSlice";
import axios from 'axios';
import { message } from 'antd';
import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

class ThemeStyles {
  constructor(theme) {
    this.theme = theme;
  }

  get textColor() {
    return this.theme === "dark" ? '#fff' : '#000';
  }

  get backgroundColor() {
    return this.theme === "dark" ? '#555' : '#f0f0f0';
  }

  get borderColor() {
    return this.theme === "dark" ? '#777' : '#d3d3d3';
  }

  get buttonBackgroundColor() {
    return this.theme === "dark" ? '#333' : '#ddd';
  }

  get inputTextColor() {
    return this.theme === "dark" ? '#fff' : '#000';
  }

  get inputBackgroundColor() {
    return this.theme === "dark" ? '#000' : '#fff';
  }
}

function WeatherStatsNavbar({ value, weatherType, day }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContentKey, setModalContentKey] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("TR");
  const { theme, toggleTheme } = useContext(ThemeContext);
  const themeStyles = new ThemeStyles(theme);

  const [cityName, setCityName] = useState("");
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const [userId, setUserId] = useState(null);
  const [savedCity, setSavedCity] = useState(localStorage.getItem('city') || '');
  const [ulke, setUlke] = useState(localStorage.getItem('ulke') || '');
  const [userName, setUserName] = useState(localStorage.getItem('userName')|| '');
  const [firstName, setfirstname] = useState(localStorage.getItem('firstName') || '');
  const [lastName, setlastName] = useState(localStorage.getItem('lastName') || '');
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [phone, setPhone] = useState(localStorage.getItem('phone') || '');
  const [profilePicture, setProfilePicture] = useState(localStorage.getItem('profilePicture') || '');

  const navigate = useNavigate();

  const [robotName, setRobotName] = useState("");
  const [robotColor, setRobotColor] = useState("");

  const handleSaveCityAndCoordinates = (cityName) => {
    localStorage.setItem('city', cityName);
    setSavedCity(cityName);
    
    updateCityAndGetCoordinates(cityName);
  };

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries")
      .then((response) => response.json())
      .then((data) => setCountries(data.data))
      .catch((error) => console.error("Ülke verileri alınamadı:", error));
  }, []);

  const handleCountryChange = (country) => {
    setUlke(country);
    const countryData = countries.find((c) => c.country === country);
    setCities(countryData ? countryData.cities : []);
  };

  let WeatherIcon;
  if (weatherType === "Clear") {
    WeatherIcon = (
      <Lottie animationData={sunny} style={{ width: "5vh", height: "5vh" }} />
    );
  } else if (weatherType === "Clouds") {
    WeatherIcon = (
      <Lottie animationData={Cloudy} style={{ width: "5vh", height: "5vh" }} />
    );
  } else if (weatherType === "Rain") {
    WeatherIcon = <Rain style={{ width: "4vh", height: "4vh" }} />;
  } else {
    WeatherIcon = null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const LanguageToggle = () => {
    const languages = [
      { code: "TR", label: "TR" },
      { code: "ENG", label: "ENG" }
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
        <div style={{ color: themeStyles.textColor, marginBottom: '10px', transition: 'color 0.3s ease' }}>
          <strong>Dil Seçeneği:</strong>
        </div>
        <div style={{
          display: 'flex',
          borderRadius: '20px',
          border: `1px solid ${themeStyles.borderColor}`,
          overflow: 'hidden',
          position: 'relative',
          width: '150px',
          backgroundColor: themeStyles.backgroundColor,
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}>
          {languages.map((language) => (
            <div
              key={language.code}
              onClick={() => {
                setSelectedLanguage(language.code);
              }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: selectedLanguage === language.code ? 'bold' : 'normal',
                color: selectedLanguage === language.code ? themeStyles.textColor : '#666',
                backgroundColor: selectedLanguage === language.code ? themeStyles.buttonBackgroundColor : 'transparent',
                opacity: selectedLanguage === language.code ? 1 : 0.5,
                transition: 'all 0.3s ease'
              }}
            >
              {language.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const NotificationToggle = () => {
    const [selectedNotifications, setSelectedNotifications] = useState([]);

    const notifications = [
      { code: "MAIL", label: "Mail" },
      { code: "SMS", label: "SMS" },
      { code: "APP", label: "Uygulama" }
    ];

    const toggleNotification = (code) => {
      setSelectedNotifications((prev) => 
        prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]
      );
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
        <div style={{ color: themeStyles.textColor, marginBottom: '10px', transition: 'color 0.3s ease' }}>
          <strong>Bildirim Ayarları:</strong>
        </div>
        <div style={{
          display: 'flex',
          borderRadius: '20px',
          border: `1px solid ${themeStyles.borderColor}`,
          overflow: 'hidden',
          position: 'relative',
          width: '150px',
          backgroundColor: themeStyles.backgroundColor,
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}>
          {notifications.map((notification) => (
            <div
              key={notification.code}
              onClick={() => {
                toggleNotification(notification.code);
              }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: selectedNotifications.includes(notification.code) ? 'bold' : 'normal',
                color: themeStyles.textColor,
                backgroundColor: selectedNotifications.includes(notification.code) ? themeStyles.buttonBackgroundColor : 'transparent',
                opacity: selectedNotifications.includes(notification.code) ? 1 : 0.5,
                transition: 'all 0.3s ease'
              }}
            >
              {notification.label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ProfileSettings = () => {
    return (
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setfirstname(e.target.value)}
          placeholder="Ad"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: `1px solid ${themeStyles.borderColor}`,
            backgroundColor: themeStyles.inputBackgroundColor,
            color: themeStyles.inputTextColor
          }}
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setlastName(e.target.value)}
          placeholder="Soyad"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: `1px solid ${themeStyles.borderColor}`,
            backgroundColor: themeStyles.inputBackgroundColor,
            color: themeStyles.inputTextColor
          }}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: `1px solid ${themeStyles.borderColor}`,
            backgroundColor: themeStyles.inputBackgroundColor,
            color: themeStyles.inputTextColor
          }}
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Telefon"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: `1px solid ${themeStyles.borderColor}`,
            backgroundColor: themeStyles.inputBackgroundColor,
            color: themeStyles.inputTextColor
          }}
        />
        <button
          onClick={handleUpdateProfile}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: themeStyles.buttonBackgroundColor,
            color: themeStyles.textColor,
            cursor: 'pointer'
          }}
        >
          Profili Güncelle
        </button>
      </div>
    );
  };

  const showModal = (content) => {
    setModalContentKey(content);
    setIsModalVisible(true);
  };

  const updateCityAndGetCoordinates = async (cityName) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=0c0dcdc7e9b2975a7e115ed4ec2ae3ab`);
      
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setCoordinates({ latitude: lat, longitude: lon });
        dispatch(setCityCoordinates({ latitude: lat, longitude: lon }));
        setError(null);
      } else {
        setError("Şehir bulunamadı");
      }
    } catch (error) {
      setError("Koordinatlar alınamadı");
      console.error("Koordinat hatası:", error);
    }
  };

  const renderModalContent = () => {
    switch (modalContentKey) {
      case "language":
        return <LanguageToggle />;
      case "notifications":
        return <NotificationToggle />;
      case "profile":
        return <ProfileSettings />;
      case "addRobot":
        return (
          <div>
            <input
              type="text"
              value={robotName}
              onChange={(e) => setRobotName(e.target.value)}
              placeholder="Robot Adı"
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '5px',
                border: `1px solid ${themeStyles.borderColor}`,
                backgroundColor: themeStyles.inputBackgroundColor,
                color: themeStyles.inputTextColor
              }}
            />
            <input
              type="text"
              value={robotColor}
              onChange={(e) => setRobotColor(e.target.value)}
              placeholder="Robot Rengi"
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '5px',
                border: `1px solid ${themeStyles.borderColor}`,
                backgroundColor: themeStyles.inputBackgroundColor,
                color: themeStyles.inputTextColor
              }}
            />
            <button
              onClick={handleAddRobot}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: themeStyles.buttonBackgroundColor,
                color: themeStyles.textColor,
                cursor: 'pointer'
              }}
            >
              Robot Ekle
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const handleLogoutConfirmation = () => {
    Modal.confirm({
      title: 'Çıkış Yap',
      content: 'Çıkış yapmak istediğinize emin misiniz?',
      okText: 'Evet',
      cancelText: 'Hayır',
      onOk() {
        localStorage.clear();
        navigate('/signin');
      },
      onCancel() {
      },
    });
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddRobot = () => {
    console.log("Robot eklendi:", robotName, robotColor);
    setIsModalVisible(false);
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.post('https://localhost:44315/api/User/update', {
        firstName,
        lastName,
        email,
        phone
      });
      
      if (response.status === 200) {
        message.success('Profil başarıyla güncellendi');
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        localStorage.setItem('email', email);
        localStorage.setItem('phone', phone);
      }
    } catch (error) {
      message.error('Profil güncellenirken bir hata oluştu');
      console.error('Profil güncelleme hatası:', error);
    }
  };

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <div className="text-2xl font-bold mr-4">{day}</div>
        <div className="text-4xl font-bold mr-4">{value}°C</div>
        <div className="mr-4">{WeatherIcon}</div>
      </div>
      <div className="flex items-center">
        <button
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => showModal("language")}
        >
          <SunIcon className="h-6 w-6" />
        </button>
        <button
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => showModal("notifications")}
        >
          <BellIcon className="h-6 w-6" />
        </button>
        <button
          className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => showModal("profile")}
        >
          <img src={profilePicture || pp} alt="Profile" className="h-8 w-8 rounded-full" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={handleLogoutConfirmation}
        >
          <MoonIcon className="h-6 w-6" />
        </button>
      </div>
      <Modal
        title={modalTitle}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
}

export default WeatherStatsNavbar;
