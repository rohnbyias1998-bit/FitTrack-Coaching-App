export default function ClientManagement() {
  return (
    <div style={{ padding: '40px', background: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'green' }}>
        ✅ CLIENT MANAGEMENT PAGE LOADED SUCCESSFULLY
      </h1>
      <p style={{ fontSize: '18px', marginTop: '20px' }}>
        If you can see this message, the route and component work.
      </p>
      <p style={{ fontSize: '14px', marginTop: '10px', color: 'gray' }}>
        Current URL: {window.location.pathname}
      </p>
    </div>
  );
}
