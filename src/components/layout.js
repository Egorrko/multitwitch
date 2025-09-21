const generateLayout = (channels) => {
  const aspect_h = (w) => {
    return w * 6;
  };
  switch (channels.length) {
    case 1:
      return channels.map((item) => {
        const w = 12;
        const h = 64;
        return {
          x: 12,
          y: Infinity,
          w: w,
          h: h,
          i: item.channel,
          channel: item.channel,
          draggableHandle: ".react-grid-dragHandleExample",
        };
      });

    case 2:
      return channels.map((item, i) => {
        const w = 6;
        const h = aspect_h(w);
        return {
          x: Math.floor(((i * 12) / 2) % 12),
          y: Infinity,
          w: w,
          h: h,
          i: item.channel,
          channel: item.channel,
          draggableHandle: ".react-grid-dragHandleExample",
        };
      });

    case 3:
      return channels.map((item, i) => {
        const w = 4;
        const h = aspect_h(w);
        return {
          x: Math.floor(((i * 12) / 3) % 12),
          y: Infinity,
          w: w,
          h: h,
          i: item.channel,
          channel: item.channel,
          draggableHandle: ".react-grid-dragHandleExample",
        };
      });

    case 4:
      return channels.map((item, i) => {
        const w = 6;
        const h = aspect_h(w);
        return {
          x: Math.floor(((i * 12) / 2) % 12),
          y: Infinity,
          w: w,
          h: h,
          i: item.channel,
          channel: item.channel,
          draggableHandle: ".react-grid-dragHandleExample",
        };
      });

    case 5:
      return channels.map((item, i) => {
        if (i >= 2) {
          const w = 4;
          const h = aspect_h(w);
          return {
            x: Math.floor(((i * 12) / 3) % 12),
            y: Infinity,
            w: w,
            h: h,
            i: item.channel,
            channel: item.channel,
            chat: false,
            draggableHandle: ".react-grid-dragHandleExample",
          };
        } else {
          const w = 6;
          const h = aspect_h(w);
          return {
            x: Math.floor(((i * 12) / 2) % 12),
            y: 0,
            w: w,
            h: h,
            i: item.channel,
            channel: item.channel,
            draggableHandle: ".react-grid-dragHandleExample",
          };
        }
      });

    case 6:
      return channels.map((item, i) => {
        const w = 4;
        const h = aspect_h(w);
        return {
          x: Math.floor(((i * 12) / 3) % 12),
          y: Infinity,
          w: w,
          h: h,
          i: item.channel,
          channel: item.channel,
          chat: false,
          draggableHandle: ".react-grid-dragHandleExample",
        };
      });

    default: {
      const h = channels.length > 8 ? 18 : 33;
      const y = Math.round(channels.length / 4 + (channels.length % 4)) * h;
      return channels.map((item, i) => {
        if (item?.pos >= 0) {
          return {
            x: Math.floor(((item.pos * 12) / 4) % 12),
            y: Math.floor((item.pos * y) / 4),
            w: 3,
            h: h,
            i: item.channel,
            channel: item.channel,
            chat: false,
            draggableHandle: ".react-grid-dragHandleExample",
          };
        }
        return {
          x: Math.floor(((i * 12) / 4) % 12),
          y: Infinity,
          w: 3,
          h: h,
          i: item.channel,
          channel: item.channel,
          chat: false,
          draggableHandle: ".react-grid-dragHandleExample",
        };
      });
    }
  }
};

export default generateLayout;
