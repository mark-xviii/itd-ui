import { useState } from 'react';
import { MovingTilesAnimation } from '../../components/MovingTilesAnimation/MovingTilesAnimation';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import './AuthScreen.sass';

export function AuthScreen({ children }: { children: any }) {
  const [sidebarToggle, setSidebarToggle] = useState<boolean>(false);

  return (
    <div className="auth-screen">
      <MovingTilesAnimation className="auth-screen-bg" />
      <div className="auth-window">{children}</div>
      <Sidebar isToggle={sidebarToggle} setToggle={setSidebarToggle} />
    </div>
  );
}
