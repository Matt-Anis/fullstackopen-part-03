const Notification = ({ notification }) => {
  if (notification == null) return null

  const { message, isError = false } = notification;

  const style = {
    color: "white",
    backgroundColor: isError ? "red" : "green",
    padding: "16px",
    borderRadius: "8px",
    margin: "8px 0 8px 0"
  };

  if (message == null) return null

  return <div style={style}>{message}</div>;
};

export default Notification;
