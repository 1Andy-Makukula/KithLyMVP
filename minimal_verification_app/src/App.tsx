import ShopProducts from './ShopProducts';
import ShopSettings from './ShopSettings';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
        <h2>Shop Products</h2>
        <ShopProducts />
      </div>
      <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
        <h2>Shop Settings</h2>
        <ShopSettings />
      </div>
    </div>
  )
}

export default App
