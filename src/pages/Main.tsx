/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import type { BikeStation } from '../types';

// Kakao Maps SDK를 사용하기 위해 Window 객체에 kakao 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

const Main = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [stations, setStations] = useState<BikeStation[]>([]);
  const [map, setMap] = useState<any>(null);
  const [clusterer, setClusterer] = useState<any>(null);

  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [result, setResult] = useState<{
    startStation: BikeStation;
    endStation: BikeStation;
    startPoint: any;
    destPoint: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const markers = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);

  // 1. 카카오 지도 스크립트 동적 로딩 및 지도 초기화

  // 1. 카카오 지도 스크립트 동적 로딩 및 지도 초기화
  useEffect(() => {
    const mapScript = document.createElement('script');
    mapScript.async = true;
    // 혼합 콘텐츠 방지: https 고정 사용
    mapScript.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAOMAP_KEY}&libraries=services,clusterer&autoload=false`;
    const onLoadKakaoMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        console.error('Kakao Maps SDK가 로드되지 않았습니다. VITE_KAKAOMAP_KEY를 확인하세요.');
        return;
      }
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        if (!container) return;
        const options = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 서울시청
          level: 8,
        };
        const newMap = new window.kakao.maps.Map(container, options);
        setMap(newMap);

        const newClusterer = new window.kakao.maps.MarkerClusterer({
          map: newMap,
          averageCenter: true,
          minLevel: 6,
        });
        setClusterer(newClusterer);
      });
    };

    const onKakaoSdkError = () => {
      console.error('Kakao Maps SDK 로드 실패: 네트워크 또는 appkey를 확인하세요.');
    };

    mapScript.addEventListener('load', onLoadKakaoMap);
    mapScript.addEventListener('error', onKakaoSdkError);
    document.head.appendChild(mapScript);

    return () => {
      mapScript.removeEventListener('load', onLoadKakaoMap);
      mapScript.removeEventListener('error', onKakaoSdkError);
    };
  }, []);

  // 0. 인증 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  // 2. 서울시 따릉이 API 데이터 호출
  useEffect(() => {
    const fetchBikeStations = async () => {
      setIsLoading(true);
      const apiKey = import.meta.env.VITE_SEOUL_API_KEY as string | undefined;
      if (!apiKey) {
        console.error('VITE_SEOUL_API_KEY가 설정되지 않았습니다. .env를 확인하고 서버를 재시작하세요.');
        setIsLoading(false);
        return;
      }

      let allStations: BikeStation[] = [];
      const totalCount = 3000; // API가 한번에 1000개까지만 반환하므로, 충분한 수를 호출
      const protocol = location.protocol === 'https:' ? 'https' : 'http';

      try {
        for (let i = 1; i < totalCount; i += 1000) {
          const url = `${protocol}://openapi.seoul.go.kr:8088/${apiKey}/json/bikeList/${i}/${i + 999}/`;
          const response = await fetch(url);
          if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`Seoul API HTTP ${response.status}. Body: ${text.slice(0, 200)}`);
          }
          const contentType = response.headers.get('content-type') || '';
          if (!contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error(`Seoul API가 JSON이 아닌 응답을 반환했습니다. content-type=${contentType}. Snippet: ${text.slice(0, 200)}`);
          }
          const data = await response.json();
          if (data.rentBikeStatus && data.rentBikeStatus.row && data.rentBikeStatus.row.length > 0) {
            allStations = [...allStations, ...data.rentBikeStatus.row];
          } else {
            break; // 더 이상 데이터가 없으면 중단
          }
        }
        setStations(allStations);
      } catch (error) {
        console.error('Failed to fetch bike stations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBikeStations();
  }, []);

  // 3. 지도에 마커 및 클러스터러 표시
  useEffect(() => {
    if (!map || !clusterer || stations.length === 0) return;

    clusterer.clear();
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];

    // 검색 결과가 있으면 출발/도착 대여소만 표시, 없으면 전체 표시
    const displayStations = result
      ? [result.startStation, result.endStation]
      : stations;

    const newMarkers = displayStations.map(station => {
      const position = new window.kakao.maps.LatLng(station.stationLatitude, station.stationLongitude);
      const marker = new window.kakao.maps.Marker({ position });

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;"><b>${station.stationName}</b><br>대여가능: ${station.parkingBikeTotCnt}</div>`,
      });

      window.kakao.maps.event.addListener(marker, 'mouseover', () => infowindow.open(map, marker));
      window.kakao.maps.event.addListener(marker, 'mouseout', () => infowindow.close());

      return marker;
    });

    markers.current = newMarkers;
    clusterer.addMarkers(newMarkers);

  }, [map, clusterer, stations, result]);

  // 4. 거리 계산 함수 (Haversine formula)
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // 5. 경로 찾기 핸들러
  const handleSearch = () => {
    if (!start || !destination) {
      alert('출발지와 도착지를 모두 입력해주세요.');
      return;
    }
    if (!map) {
      alert('지도가 아직 로딩 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    setIsSearching(true);
    setResult(null);

    const geocoder = new window.kakao.maps.services.Places();

    geocoder.keywordSearch(start, (startResult: any, startStatus: any) => {
      if (startStatus !== window.kakao.maps.services.Status.OK) {
        alert('출발지 주소를 찾을 수 없습니다.');
        setIsSearching(false);
        return;
      }

      geocoder.keywordSearch(destination, (destResult: any, destStatus: any) => {
        if (destStatus !== window.kakao.maps.services.Status.OK) {
          alert('도착지 주소를 찾을 수 없습니다.');
          setIsSearching(false);
          return;
        }

        const startPoint = startResult[0];
        const destPoint = destResult[0];

        let startStation: BikeStation | null = null;
        let minStartDist = Infinity;

        let endStation: BikeStation | null = null;
        let minEndDist = Infinity;

        stations.forEach(station => {
          if (parseInt(station.parkingBikeTotCnt, 10) > 0) {
            // 출발지 근처 대여소 찾기
            const distToStart = getDistance(
              parseFloat(startPoint.y), parseFloat(startPoint.x),
              parseFloat(station.stationLatitude), parseFloat(station.stationLongitude)
            );
            if (distToStart < minStartDist) {
              minStartDist = distToStart;
              startStation = station;
            }

            // 도착지 근처 반납소 찾기 (반납은 대여 가능 개수 상관 없지만, 편의상 같은 리스트 사용)
            const distToDest = getDistance(
              parseFloat(destPoint.y), parseFloat(destPoint.x),
              parseFloat(station.stationLatitude), parseFloat(station.stationLongitude)
            );
            if (distToDest < minEndDist) {
              minEndDist = distToDest;
              endStation = station;
            }
          }
        });

        if (startStation && endStation) {
          setResult({ startStation, endStation, startPoint, destPoint });
        } else {
          alert('주변에 이용 가능한 대여소를 찾을 수 없습니다.');
        }
        setIsSearching(false);
      });
    });
  };

  // 6. 경로 그리기 함수
  const drawRoute = async () => {
    if (!result || !map) return;

    // 기존 경로 지우기
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    const restApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY || import.meta.env.VITE_KAKAOMAP_KEY;

    // 3개의 세그먼트 좌표 정의
    const points = [
      { lat: result.startPoint.y, lng: result.startPoint.x }, // 출발지
      { lat: result.startStation.stationLatitude, lng: result.startStation.stationLongitude }, // 대여소
      { lat: result.destPoint.y, lng: result.destPoint.x }, // 도착지
      { lat: result.endStation.stationLatitude, lng: result.endStation.stationLongitude } // 반납소
    ];

    try {
      const linePath: any[] = [];

      // 3개의 구간에 대해 각각 API 호출 (순차적)
      // 1. 출발지 -> 대여소
      // 2. 대여소 -> 도착지
      // 3. 도착지 -> 반납소
      for (let i = 0; i < 3; i++) {
        const origin = `${points[i].lng},${points[i].lat}`;
        const dest = `${points[i + 1].lng},${points[i + 1].lat}`;

        const response = await fetch(
          `https://apis-navi.kakaomobility.com/v1/directions?origin=${origin}&destination=${dest}&priority=RECOMMEND`,
          {
            method: 'GET',
            headers: {
              Authorization: `KakaoAK ${restApiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) throw new Error(`API Error Segment ${i}`);

        const data = await response.json();
        const routes = data.routes[0];

        routes.sections.forEach((section: any) => {
          section.roads.forEach((road: any) => {
            road.vertexes.forEach((vertex: number, index: number) => {
              if (index % 2 === 0) {
                linePath.push(new window.kakao.maps.LatLng(road.vertexes[index + 1], road.vertexes[index]));
              }
            });
          });
        });
      }

      const polyline = new window.kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: '#FF0000',
        strokeOpacity: 0.7,
        strokeStyle: 'solid',
      });

      polyline.setMap(map);
      polylineRef.current = polyline;

      const bounds = new window.kakao.maps.LatLngBounds();
      linePath.forEach(point => bounds.extend(point));
      map.setBounds(bounds);

    } catch (error) {
      console.warn('경로 API 호출 실패, 직선 경로로 대체합니다.', error);

      // Fallback: 4개 지점을 잇는 직선
      const linePath = points.map(p => new window.kakao.maps.LatLng(parseFloat(p.lat), parseFloat(p.lng)));

      const polyline = new window.kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: '#FF0000',
        strokeOpacity: 0.7,
        strokeStyle: 'dashed',
      });

      polyline.setMap(map);
      polylineRef.current = polyline;

      const bounds = new window.kakao.maps.LatLngBounds();
      linePath.forEach(point => bounds.extend(point));
      map.setBounds(bounds);
    }
  };


  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* 로그인 안 되어 있을 때 오버레이 */}
      {authChecked && !isLoggedIn && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>로그인이 필요합니다</h2>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#fff',
              backgroundColor: '#007bff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'background-color 0.2s'
            }}
          >
            로그인 하러 가기
          </button>
        </div>
      )}

      <div id="map" style={{ width: '100%', height: '100%' }}>
        {isLoading && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            padding: '10px 20px', background: 'white', borderRadius: '5px', zIndex: 10,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            따릉이 정보를 불러오는 중입니다...
          </div>
        )}
      </div>
      <div style={{
        position: 'absolute', top: '20px', left: '20px', background: 'white',
        padding: '15px', borderRadius: '10px', zIndex: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        width: '350px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>따릉이 경로 안내</h1>
          {isLoggedIn && (
            <Link to="/mypage">
              <button style={{
                padding: '6px 12px',
                fontSize: '12px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                마이페이지
              </button>
            </Link>
          )}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="출발지"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="도착지"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isLoading || isSearching}
          style={{
            width: '100%', padding: '10px', background: '#007bff', color: 'white',
            border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer'
          }}
        >
          {isSearching ? '경로 검색 중...' : '길찾기'}
        </button>
        {result && (
          <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold' }}>검색 결과</h2>
            <div style={{ fontSize: '14px', margin: '8px 0' }}>
              <p>1. 출발지 → <b>{result.startStation.stationName}</b> (대여)</p>
              <p>2. <b>{result.startStation.stationName}</b> → 도착지</p>
              <p>3. 도착지 → <b>{result.endStation.stationName}</b> (반납)</p>
            </div>
            <a
              href={`https://map.kakao.com/link/to/${result.startStation.stationName},${result.startStation.stationLatitude},${result.startStation.stationLongitude}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', marginBottom: '8px', color: '#007bff' }}
            >
              1. 출발지 → 대여소 길찾기
            </a>
            <a
              href={`https://map.kakao.com/link/to/${result.endStation.stationName},${result.endStation.stationLatitude},${result.endStation.stationLongitude}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', color: '#007bff' }}
            >
              2. 도착지 → 반납소 길찾기
            </a>
            <button
              onClick={drawRoute}
              style={{
                marginTop: '10px',
                width: '100%',
                padding: '8px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              내 사이트에서 경로 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
