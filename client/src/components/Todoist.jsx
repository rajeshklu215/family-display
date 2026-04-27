import React, { useState, useEffect } from 'react';

export default function Todoist() {
  const [sections, setSections] = useState([]);
  const [unsectioned, setUnsectioned] = useState([]);

  useEffect(() => {
    const load = () => fetch('/api/todoist').then(r => r.json()).then(d => {
      setSections(d.sections || []);
      setUnsectioned(d.unsectioned || []);
    }).catch(() => {});
    load();
    const t = setInterval(load, 300000);
    return () => clearInterval(t);
  }, []);

  const pClass = (p) => `priority p${p || 4}`;

  return (
    <div className="widget todoist-projects">
      <h2>✅ To-Do</h2>
      {unsectioned.length > 0 && (
        <div className="project-col" style={{marginBottom: 10}}>
          {unsectioned.map(t => (
            <div key={t.id} className="todo-item">
              <span className={pClass(t.priority)} />
              <span>{t.content}</span>
            </div>
          ))}
        </div>
      )}
      <div className="projects-grid">
        {sections.map(sec => (
          <div key={sec.id} className="project-col">
            <h3 className="project-name">{sec.name}</h3>
            {sec.tasks.length === 0 && <div className="project-empty">No tasks</div>}
            {sec.tasks.slice(0, 5).map(t => (
              <div key={t.id} className="todo-item">
                <span className={pClass(t.priority)} />
                <span>{t.content}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
