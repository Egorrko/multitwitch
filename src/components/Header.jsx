import React, { useCallback, useState, lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTimes,
  faEdit,
  faSave,
  faPlus,
  faAngleDoubleRight,
  faAngleDoubleLeft,
  faSignOutAlt,
  faHandshake,
  faClock,
  faEye,
  faUser,
  faSyncAlt,
  faMagic,
  faDownload,
  faTrash,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { faTwitch, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
const ChannelTooltip = lazy(() => import("./ToolTipChannel"));
const SavesTooltip = lazy(() => import("./ToolTipSaves"));
import ReactTooltip from "react-tooltip";
import axios from "axios";
import process from "process";
import { withCookies } from "react-cookie";
import { useEffect } from "react";
import useInterval from "use-interval";
import StreamersList from "./StreamersList";

library.add(
  faTimes,
  faEdit,
  faSave,
  faPlus,
  faAngleDoubleRight,
  faAngleDoubleLeft,
  faTwitch,
  faSignOutAlt,
  faHandshake,
  faClock,
  faGithub,
  faEye,
  faUser,
  faSyncAlt,
  faMagic,
  faDownload,
  faTrash,
  faSort
);

function Header({
  isAuth,
  user,
  saves,
  isEditMode,
  isCollapse,
  isAutoSize,
  handleEditMode,
  handleSave,
  handleLoadSave,
  handleDeleteSave,
  handleReset,
  handleAutoSize,
  onAddChannel,
  onRemoveChannel,
  onAddChannels,
  onRemoveChannels,
  setIsCollapse,
  handleWindow,
  cookies,
  logout,
  disabledSave,
  channels,
}) {
  const { t } = useTranslation();
  const [streams, setStreams] = useState();
  const [orderBy, setOrderBy] = useState();

  useEffect(() => {
    if (!isCollapse && isEditMode && isAuth && user) {
      getOrderBy(user);
    }
  }, [isAuth, isEditMode, isCollapse, getOrderBy, user]);

  useEffect(() => {
    if (isEditMode || saves?.channels?.length > 0 || streams?.length > 0)
      ReactTooltip.rebuild();
  }, [isEditMode, saves, streams]);

  useInterval(
    () => getFollowedStream(orderBy, user),
    orderBy && !isCollapse && isEditMode && isAuth ? 20000 : null,
    false
  );

  const getOrderBy = useCallback(
    (user) => {
      if (!orderBy) {
        import("lodash.orderby").then((module) => {
          setOrderBy(() => {
            getFollowedStream(module.default, user);
            return module.default;
          });
        });
      } else getFollowedStream(orderBy, user);
    },
    [orderBy, getFollowedStream]
  );

  const getFollowedStream = useCallback(
    (orderBy, user) => {
      axios
        .get(
          `https://api.twitch.tv/helix/streams/followed?user_id=${user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.get("token")}`,
              "Client-ID": process.env.TWITCH_CLIENTID,
            },
          }
        )
        .then(async (res) => {
          const streams = res.data?.data ?? [];
          const users = await getUsers(streams.map((s) => s.user_id));
          const games = await getGames(streams.map((s) => s.game_id));
          const result = streams.map((s) => ({
            stream: s,
            game: games.find((g) => g.id === s.game_id) ?? [],
            user: users.find((u) => u.id === s.user_id) ?? [],
          }));
          setStreams(orderBy(result, "stream.viewer_count", "desc"));
        })
        .catch(() => setStreams());
    },
    [cookies, getGames, getUsers]
  );

  const getUsers = useCallback(
    async (users) => {
      try {
        const res = await axios.get(
          `https://api.twitch.tv/helix/users?id=${users.join("&id=")}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.get("token")}`,
              "Client-ID": process.env.TWITCH_CLIENTID,
            },
          }
        );
        return res.data.data;
      } catch (error) {
        return null;
      }
    },
    [cookies]
  );

  const getGames = useCallback(
    async (games) => {
      try {
        const res = await axios.get(
          `https://api.twitch.tv/helix/games?id=${games.join("&id=")}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.get("token")}`,
              "Client-ID": process.env.TWITCH_CLIENTID,
            },
          }
        );
        return res.data.data;
      } catch (error) {
        return null;
      }
    },
    [cookies]
  );

  const handleCollapse = () => setIsCollapse((c) => !c);

  return (
    <CSSTransition in={isCollapse} classNames="header" timeout={300}>
      <header style={{ display: "flex" }}>
        <nav>
          <button
            onClick={handleSave}
            disabled={disabledSave}
            title={t("save-button.title")}
          >
            <FontAwesomeIcon icon="save" />
          </button>
          <button onClick={handleReset} title={t("reset-button.title")}>
            <FontAwesomeIcon icon="sync-alt" />
          </button>
          {/*<button
            disabled={disabledSort}
            onClick={handleSort}
            title={t("sort-button.title")}
          >
            <FontAwesomeIcon icon="sort" />
          </button>*/}
          <button onClick={handleAutoSize} title={t("auto_size-button.title")}>
            <FontAwesomeIcon
              icon="magic"
              color={!isAutoSize ? "#cc8686" : ""}
            />
          </button>
          {isAuth ? (
            <button onClick={handleCollapse} className="img-profile">
              <img
                src={user?.profile_image_url.replace(/\d+x\d+/, "70x70")}
                height={24}
                width={24}
                alt="profile"
              />
            </button>
          ) : (
            <button title={t("connect-button.text")} onClick={handleWindow}>
              <FontAwesomeIcon icon={["fab", "twitch"]} />
            </button>
          )}
          <button onClick={handleEditMode} title={t("edit-button.title")}>
            <FontAwesomeIcon icon="edit" color={!isEditMode ? "#cc8686" : ""} />
          </button>
        </nav>
        {saves?.channels?.length > 0 && (
          <nav
            className="saves"
            style={{ display: isEditMode ? "block" : "none" }}
          >
            <div className="items-saves">
              <span
                className="text"
                data-for="saves"
                data-tip={JSON.stringify(saves.channels)}
              >
                {saves.channels.length} {t("menu.save")}
              </span>
              <div className="buttons">
                <button
                  onClick={handleLoadSave}
                  title={t("load_save-button.title")}
                >
                  <FontAwesomeIcon icon="download" />
                </button>
                <button
                  onClick={handleDeleteSave}
                  title={t("delete_save-button.title")}
                >
                  <FontAwesomeIcon icon="trash" />
                </button>
              </div>
            </div>
          </nav>
        )}

        {isAuth && (
          <nav
            className="streams"
            style={{ display: isEditMode ? "block" : "none" }}
          >
            <p
              style={{
                textAlign: "center",
                background: "#b34646",
                cursor: "default",
                height: "24px",
              }}
            >
              <button
                onClick={() => {
                  logout().then(() => ReactTooltip.hide());
                }}
                title={t("logout-button.text")}
                style={{ position: "absolute", left: 0 }}
              >
                <FontAwesomeIcon icon="sign-out-alt" />
              </button>
              <span className="twitch-pseudo">{user?.display_name}</span>
            </p>
            {streams?.length > 0 && (
              <div className="stream-list">
                {streams.map((v) => {
                  return (
                    <p
                      key={v.user.id}
                      onClick={() => onAddChannel(v.user.login)}
                      data-for="status"
                      data-tip={JSON.stringify(v)}
                    >
                      <img
                        alt=""
                        height={22}
                        width={22}
                        src={v.user.profile_image_url.replace(
                          /\d+x\d+/,
                          "70x70"
                        )}
                      />
                      <span className="stream-name">{v.user.display_name}</span>
                    </p>
                  );
                })}
              </div>
            )}
          </nav>
        )}
        <Suspense fallback="">
          <SavesTooltip FontAwesomeIcon={FontAwesomeIcon} />
        </Suspense>
        <Suspense fallback="">
          <ChannelTooltip FontAwesomeIcon={FontAwesomeIcon} />
        </Suspense>
        <StreamersList
          channels={channels}
          onAddChannel={onAddChannel}
          onRemoveChannel={onRemoveChannel}
          onAddChannels={onAddChannels}
          onRemoveChannels={onRemoveChannels}
        />
      </header>
    </CSSTransition>
  );
}

Header.propTypes = {
  isAuth: PropTypes.bool,
  user: PropTypes.any,
  saves: PropTypes.any,
  isEditMode: PropTypes.bool,
  isCollapse: PropTypes.bool,
  isAutoSize: PropTypes.bool,
  handleEditMode: PropTypes.func,
  handleSave: PropTypes.func,
  handleLoadSave: PropTypes.func,
  handleDeleteSave: PropTypes.func,
  handleReset: PropTypes.func,
  handleSort: PropTypes.func,
  handleAutoSize: PropTypes.func,
  onAddChannel: PropTypes.func,
  onRemoveChannel: PropTypes.func,
  onAddChannels: PropTypes.func,
  onRemoveChannels: PropTypes.func,
  setIsCollapse: PropTypes.func,
  handleWindow: PropTypes.func,
  cookies: PropTypes.any,
  logout: PropTypes.func,
  disabledSave: PropTypes.bool,
  disabledSort: PropTypes.bool,
  channels: PropTypes.array,
};

export default withCookies(Header);
