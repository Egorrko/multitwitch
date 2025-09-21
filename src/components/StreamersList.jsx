import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./StreamersList.css";

function StreamersList({
  channels,
  onAddChannel,
  onRemoveChannel,
  onAddChannels,
  onRemoveChannels,
}) {
  const [streamers, setStreamers] = useState([]);

  useEffect(() => {
    const fetchStreamers = async () => {
      try {
        const response = await axios.get(
          "https://freakland.egorrko.ru/public-api/streams"
        );
        if (response.data && response.data.streamers) {
          setStreamers(response.data.streamers);
        }
      } catch (error) {
        alert("Error fetching streamers");
      }
    };

    fetchStreamers();
    const intervalId = setInterval(fetchStreamers, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const currentChannelNames = channels.map((c) => c.channel);

  const handleEnableAll = () => {
    const streamersToAdd = streamers
      .filter((s) => !currentChannelNames.includes(s.nickname.toLowerCase()))
      .map((s) => s.nickname);
    onAddChannels(streamersToAdd);
  };

  const handleDisableAll = () => {
    const streamersToRemove = streamers
      .filter((s) => currentChannelNames.includes(s.nickname.toLowerCase()))
      .map((s) => s.nickname);
    onRemoveChannels(streamersToRemove);
  };

  return (
    <div className="streamers-list">
      <div className="streamers-list__actions">
        <button onClick={handleEnableAll} className="streamer-button">
          Включить всех
        </button>
        <button onClick={handleDisableAll} className="streamer-button">
          Выключить всех
        </button>
      </div>
      <div className="streamers-list__buttons">
        {streamers.map((streamer) => {
          const isChannelAdded = currentChannelNames.includes(
            streamer.nickname.toLowerCase()
          );

          return (
            <button
              className={
                isChannelAdded ? "streamer-button active" : "streamer-button"
              }
              key={streamer.nickname}
              onClick={() =>
                isChannelAdded
                  ? onRemoveChannel(streamer.nickname)
                  : onAddChannel(streamer.nickname)
              }
            >
              {streamer.nickname} ({streamer.viewer_count})
            </button>
          );
        })}
      </div>
    </div>
  );
}

StreamersList.propTypes = {
  channels: PropTypes.array.isRequired,
  onAddChannel: PropTypes.func.isRequired,
  onRemoveChannel: PropTypes.func.isRequired,
  onAddChannels: PropTypes.func.isRequired,
  onRemoveChannels: PropTypes.func.isRequired,
};

export default StreamersList;
