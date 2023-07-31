import React from "react";
import "../styles/stats-2.css";

type Props = {};

interface Data {
  name: string;
  icon: string;
  value: number;
  percentage: string;
}

const StatsPgTwo = (props: Props) => {
  const topTracksData: Data[] = [
    { name: "Track 1", icon: "bar-icon", value: 1495, percentage: "60%" },
    { name: "Track 2", icon: "bar-icon", value: 1242, percentage: "45%" },
    { name: "Track 3", icon: "bar-icon", value: 1002, percentage: "32%" },
    { name: "Track 4", icon: "bar-icon", value: 800, percentage: "25%" },
    { name: "Track 5", icon: "bar-icon", value: 425, percentage: "20%" },
  ];
  const topArtistsData: Data[] = [
    { name: "Artist 1", icon: "bar-icon", value: 1495, percentage: "60%" },
    { name: "Artist 2", icon: "bar-icon", value: 1242, percentage: "45%" },
    { name: "Artist 3", icon: "bar-icon", value: 1002, percentage: "32%" },
    { name: "Artist 4", icon: "bar-icon", value: 800, percentage: "25%" },
    { name: "Artist 5", icon: "bar-icon", value: 425, percentage: "20%" },
  ];
  return (
    <div className="top-stats-main-container-wrapper center column">
      <div className="top-stats-heading">
        <h1>Top Tracks</h1>
        <h1>2023</h1>
        <h1>Top Artists</h1>
      </div>

      <div className="top-stats-main-container center">
        <div className="top-tracks-container column">
          <div className="left-graph column">
            {topTracksData.map((track, index) => {
              return (
                <div key={`track-${index}`}>
                  <div className={`bar`} style={{ width: track.percentage }}>
                    {track.name}
                  </div>
                  <div className="bar-icon"></div>
                  <div className="bar-stat-value">{track.value}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="top-artists-container column">
          <div className="right-graph column">
            {topArtistsData.map((artist, index) => {
              return (
                <div key={`artist-${index}`}>
                  <div className="bar-stat-value">{artist.value}</div>
                  <div className="bar-track-icon"></div>
                  <div className={`bar`} style={{ width: artist.percentage }}>
                    {artist.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPgTwo;
