import { navigate } from '../router.js';
import { getAllGameModels } from '../services/gameModelService.js';
import { createThemeToggle } from '../components/ThemeToggle.js';

/**
 * Render the models view
 */
export function renderModels() {
  const models = getAllGameModels();

  document.body.innerHTML = `
    <div class="view models-view">
      <header class="view-header">
        <button type="button" class="back-btn" id="back">&larr;</button>
        <h1>Modèles de jeux</h1>
        <div class="header-actions" id="headerActions"></div>
      </header>

      <div class="models-list">
        ${models.map(model => `
          <div class="model-card">
            <h3>${model.label}</h3>
            <p class="model-description">${model.description}</p>
            <div class="model-info">
              <span class="model-players">${model.minPlayers}-${model.maxPlayers} joueurs</span>
              <span class="model-type">${model.type === 'rounds' ? 'Par manches' : 'Score calculé'}</span>
            </div>
            ${model.fields ? `
              <div class="model-fields">
                ${model.fields.map(f => `<span class="field-tag">${f.icon || ''} ${f.label}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('back').addEventListener('click', () => navigate('home'));
  document.getElementById('headerActions').appendChild(createThemeToggle());
}
