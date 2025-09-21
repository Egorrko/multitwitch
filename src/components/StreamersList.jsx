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
  const [streamers, setStreamers] = useState({ simple: [], fl: [] });

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
    const allStreamers = [...streamers.fl, ...streamers.simple];
    const streamersToAdd = allStreamers
      .filter(
        (s) => !currentChannelNames.includes(s.twitch_nickname.toLowerCase())
      )
      .map((s) => s.twitch_nickname);
    onAddChannels(streamersToAdd);
  };

  const handleDisableAll = () => {
    const allStreamers = [...streamers.fl, ...streamers.simple];
    const streamersToRemove = allStreamers
      .filter((s) =>
        currentChannelNames.includes(s.twitch_nickname.toLowerCase())
      )
      .map((s) => s.twitch_nickname);
    onRemoveChannels(streamersToRemove);
  };

  const renderStreamerList = (list) => {
    return list.map((streamer) => {
      const isChannelAdded = currentChannelNames.includes(
        streamer.twitch_nickname.toLowerCase()
      );

      return (
        <button
          className={
            isChannelAdded ? "streamer-button active" : "streamer-button"
          }
          key={streamer.nickname}
          onClick={() =>
            isChannelAdded
              ? onRemoveChannel(streamer.twitch_nickname)
              : onAddChannel(streamer.twitch_nickname)
          }
        >
          {streamer.nickname} ({streamer.viewer_count})
        </button>
      );
    });
  };

  return (
    <div className="streamers-list">
      <div>
        <button onClick={handleEnableAll} className="streamer-button">
          Включить всех
        </button>
        <button onClick={handleDisableAll} className="streamer-button">
          Выключить всех
        </button>
      </div>
      <div className="streamers-list">
        {streamers.fl.length > 0 ? <p>В игре:</p> : <p>В игре: никого 😔</p>}
        <div className="streamers-list">{renderStreamerList(streamers.fl)}</div>
      </div>
      <div className="streamers-list">
        {streamers.simple.length > 0 ? <p>Не FL:</p> : <p>Не FL: никого 😔</p>}
        <div className="streamers-list">
          {renderStreamerList(streamers.simple)}
        </div>
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
