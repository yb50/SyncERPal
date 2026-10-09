function PageToolbar({ children, actions }) {
  return (
    <div className="page-toolbar">
      <div className="page-toolbar-controls">{children}</div>

      {actions && <div className="page-toolbar-actions">{actions}</div>}
    </div>
  );
}

export default PageToolbar;