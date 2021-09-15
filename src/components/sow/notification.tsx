import { useEffect, useState } from "react";
import style from "../../styles/sow/notification.module.css";

type notification = {
  id: string;
  appid: string;
  appname: string;
  message: string;
};

type props = {
  OpenApp: (app_id: string) => void;
};

export default function Notification({ OpenApp }: props) {
  const [notifications, setNotifications] = useState<notification[]>([]);
  const [Notification2Remove, setNotification2Remove] = useState<
    notification[] | null
  >();

  useEffect(() => {
    async function getNotification(): Promise<void> {
      const req = await fetch("http://127.0.0.1/ecardapio/api/getnotificacoes");
      const res: notification[] = await req.json();

      if (res) {
        const container_notification = document.getElementById(
          "notifications"
        ) as HTMLElement;

        if (container_notification.childElementCount === 0) {
          setNotifications([...res]);
          container_notification.style.transform = "translateY(-40px)";
        } else {
          container_notification.style.minHeight =
            (container_notification.offsetHeight /
              container_notification.childElementCount) *
              res.length +
            container_notification.offsetHeight +
            "px";

          new Promise((r) => setTimeout(r, 300)).then(() =>
            setNotifications((state) => [...state, ...res])
          );
        }

        setTimeout(() => {
          setNotification2Remove(res);
        }, 5000);
      }
    }

    setInterval(() => {
      getNotification();
    }, 10000);
  }, []);

  useEffect(() => {
    if (Notification2Remove && notifications) {
      const removedNotification = [...notifications];
      const container_notification = document.getElementById(
        "notifications"
      ) as HTMLElement;

      if (Notification2Remove.length === notifications.length) {
        container_notification.removeAttribute("style");
      } else {
        container_notification.style.minHeight =
          container_notification.offsetHeight -
          (container_notification.offsetHeight / notifications.length) *
            Notification2Remove.length +
          "px";
      }

      for (let i = 0; i < Notification2Remove.length; i++) {
        let notificationIndex = removedNotification.findIndex(
          (notification) => notification === Notification2Remove[i]
        );
        /* (
          document.getElementById(
            `notification_${Notification2Remove[i].id}`
          ) as HTMLElement
        ).style.opacity = "0"; */
        removedNotification.splice(notificationIndex, 1);
      }
      new Promise((r) => setTimeout(r, 300)).then(() => {
        setNotifications(removedNotification);
        setNotification2Remove(null);
      });
    }
  }, [Notification2Remove]);

  function fadein({ parentElement: notification }: HTMLElement) {
    if (notification) {
      new Promise((r) => setTimeout(r, 100)).then(
        () => (notification.style.opacity = "1")
      );
    }
  }

  return (
    <ul id="notifications" className={style.notification}>
      {notifications?.map((notification) => (
        <li
          id={`notification_${notification.id}`}
          style={{ opacity: "0" }}
          key={"not_" + notification.id}
          onClick={() => OpenApp(notification.appid)}
        >
          <img
            onLoad={(e) => fadein(e.currentTarget)}
            src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
          />
          <h4>{notification.appname}</h4>
          <p>{notification.message}</p>
        </li>
      ))}
    </ul>
  );
}
