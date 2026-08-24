(function () {
  'use strict';

  if (window.__SHD_WIDGET_WRITE_ACTIONS__) return;
  window.__SHD_WIDGET_WRITE_ACTIONS__ = true;

  var copy = {
    ru: {
      actions: 'Действия',
      chooseAction: 'Выберите действие',
      selectRecord: 'Сначала выберите запись.',
      submit: 'Сохранить',
      cancel: 'Отмена',
      confirm: 'Подтверждаю действие',
      warning: 'Проверьте данные перед записью.',
      destructive: 'Операция может изменить или удалить данные.',
      required: 'Заполните обязательное поле.',
      invalidJson: 'Введите корректный JSON.',
      success: 'Изменения сохранены.',
      failure: 'Не удалось сохранить изменения.',
      loading: 'Сохраняю…',
      noActions: 'Для этого виджета нет доступных действий.',
      refreshed: 'Список обновлён.',
      fieldValue: 'Значение',
    },
    en: {
      actions: 'Actions',
      chooseAction: 'Choose an action',
      selectRecord: 'Select a record first.',
      submit: 'Save',
      cancel: 'Cancel',
      confirm: 'I confirm this action',
      warning: 'Review the values before writing.',
      destructive: 'This operation may change or remove data.',
      required: 'Fill in the required field.',
      invalidJson: 'Enter valid JSON.',
      success: 'Changes saved.',
      failure: 'Could not save changes.',
      loading: 'Saving…',
      noActions: 'No actions are available for this widget.',
      refreshed: 'List refreshed.',
      fieldValue: 'Value',
    },
  };

  var state = {
    widget: {},
    records: [],
    selected: null,
    action: null,
    inputs: {},
    busy: false,
    lang: String(document.documentElement.lang || 'ru').toLowerCase().indexOf('ru') === 0 ? 'ru' : 'en',
  };
  var pending = new Map();
  var nextRequestId = 1;
  var elements = {};

  function t(key) {
    return (copy[state.lang] && copy[state.lang][key]) || copy.en[key] || key;
  }

  function object(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
  }

  function normalize(value) {
    if (!value) return null;
    if (value.structuredContent) return normalize(value.structuredContent);
    if (value.toolOutput) return normalize(value.toolOutput);
    if (value.toolInput) return normalize(value.toolInput);
    if (value.arguments && !value.data && !value.items && !value.projects) return normalize(value.arguments);
    return value;
  }

  function widgetFrom(value) {
    var payload = normalize(value) || {};
    var meta = object(payload.meta) ? payload.meta : {};
    return object(meta.widget) ? meta.widget : {};
  }

  function recordsFrom(value) {
    var payload = normalize(value) || {};
    var data = Array.isArray(payload.items) ? payload.items : payload.projects;
    if (!Array.isArray(data)) data = payload.data;
    if (data && !Array.isArray(data) && Array.isArray(data.data)) data = data.data;
    return Array.isArray(data) ? data.filter(function (item) { return object(item); }) : [];
  }

  function readPath(value, path) {
    if (!value || path === undefined || path === null) return undefined;
    var parts = String(path).split('.');
    var current = value;
    for (var index = 0; index < parts.length; index += 1) {
      if (current === undefined || current === null) return undefined;
      current = current[parts[index]];
    }
    return current;
  }

  function firstValue(paths) {
    var list = Array.isArray(paths) ? paths : [paths];
    var sources = [state.selected, state.widget.sourceArgs, state.widget.listArgs];
    for (var sourceIndex = 0; sourceIndex < sources.length; sourceIndex += 1) {
      var sourceObject = sources[sourceIndex];
      if (!sourceObject) continue;
      for (var pathIndex = 0; pathIndex < list.length; pathIndex += 1) {
        var value = readPath(sourceObject, list[pathIndex]);
        if (value !== undefined && value !== null && value !== '') return value;
      }
    }
    return undefined;
  }

  function text(value) {
    if (value === undefined || value === null) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  function label(value) {
    if (object(value)) return value[state.lang] || value.ru || value.en || t('fieldValue');
    return String(value || t('fieldValue'));
  }

  function actionLabel(action) {
    return label(action && action.label) || action.id || action.tool || t('actions');
  }

  function hasTargets(action) {
    return Boolean(action && ((Array.isArray(action.targets) && action.targets.length) || action.target));
  }

  function actionList() {
    return Array.isArray(state.widget.actions) ? state.widget.actions.filter(function (action) {
      return action && action.tool;
    }) : [];
  }

  function request(method, params) {
    var openai = typeof window !== 'undefined' ? window.openai : undefined;
    if (method === 'tools/call' && openai && typeof openai.callTool === 'function') {
      return openai.callTool(params.name, params.arguments || {});
    }
    var id = nextRequestId++;
    window.parent.postMessage({ jsonrpc: '2.0', id: id, method: method, params: params || {} }, '*');
    return new Promise(function (resolve, reject) {
      var timeout = window.setTimeout(function () {
        pending.delete(id);
        reject(new Error(t('failure')));
      }, 15000);
      pending.set(id, { resolve: resolve, reject: reject, timeout: timeout });
    });
  }

  function unwrap(value) {
    var payload = normalize(value);
    if (value && value.isError) throw new Error(payload && payload.error ? text(payload.error) : t('failure'));
    if (payload && payload.error) throw new Error(text(payload.error));
    return payload || value;
  }

  function make(tag, value, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  }

  function ensurePanel() {
    if (elements.panel) return;
    var root = document.querySelector('main') || document.body;
    var panel = make('section', undefined, 'shd-widget-actions');
    panel.hidden = true;
    panel.setAttribute('aria-live', 'polite');
    var header = make('div', undefined, 'shd-widget-actions-header');
    header.append(make('strong', t('actions')), make('span', '', 'shd-widget-actions-selection'));
    var select = document.createElement('select');
    select.className = 'shd-widget-actions-select';
    select.setAttribute('aria-label', t('actions'));
    var form = make('form', undefined, 'shd-widget-actions-form');
    var status = make('div', '', 'shd-widget-actions-status');
    var buttons = make('div', undefined, 'shd-widget-actions-buttons');
    var submit = make('button', t('submit'), 'shd-widget-actions-submit');
    submit.type = 'submit';
    var cancel = make('button', t('cancel'), 'shd-widget-actions-cancel');
    cancel.type = 'button';
    buttons.append(submit, cancel);
    panel.append(header, select, form, status, buttons);
    root.append(panel);
    elements = { panel: panel, selection: header.lastChild, select: select, form: form, status: status, submit: submit, cancel: cancel };
    select.addEventListener('change', function () {
      var selected = actionList().find(function (action) { return action.id === select.value; });
      state.action = selected || null;
      renderForm();
    });
    cancel.addEventListener('click', function () {
      state.action = null;
      select.value = '';
      renderForm();
    });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      submitAction();
    });
  }

  function inputValue(fieldConfig) {
    var value = firstValue(fieldConfig.source || []);
    if (value === undefined && fieldConfig.default !== undefined) value = fieldConfig.default;
    return value;
  }

  function createInput(fieldConfig) {
    var type = fieldConfig.type || 'text';
    var input;
    if (type === 'textarea' || type === 'json') {
      input = document.createElement('textarea');
      input.rows = type === 'json' ? 4 : 3;
      if (type === 'json') input.placeholder = '{ }';
    } else if (type === 'select') {
      input = document.createElement('select');
      (fieldConfig.options || []).forEach(function (option) {
        var item = document.createElement('option');
        item.value = String(option[0]);
        item.textContent = state.lang === 'ru' ? String(option[1]) : String(option[2] || option[1]);
        input.append(item);
      });
    } else {
      input = document.createElement('input');
      input.type = type === 'number' || type === 'email' ? type : 'text';
    }
    input.className = 'shd-widget-actions-input';
    input.name = fieldConfig.name;
    var value = inputValue(fieldConfig);
    if (type === 'checkbox') {
      input.type = 'checkbox';
      input.checked = value === true || value === 'true' || value === 1 || value === '1';
    } else if (value !== undefined && value !== null) {
      input.value = type === 'json' && typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
    }
    if (fieldConfig.required) input.required = true;
    return input;
  }

  function renderForm() {
    ensurePanel();
    var selectedActionId = state.action ? state.action.id : '';
    elements.select.replaceChildren();
    var placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = t('chooseAction');
    elements.select.append(placeholder);
    actionList().forEach(function (action) {
      var option = document.createElement('option');
      option.value = action.id;
      option.textContent = actionLabel(action);
      elements.select.append(option);
    });
    elements.select.value = selectedActionId;
    elements.select.hidden = actionList().length === 0;
    elements.form.replaceChildren();
    elements.status.textContent = '';
    elements.submit.disabled = state.busy;
    var action = state.action;
    if (!action) {
      elements.selection.textContent = state.selected ? text(state.selected.title || state.selected.name || state.selected.id || '') : '';
      elements.submit.hidden = true;
      elements.cancel.hidden = true;
      if (actionList().length && !state.selected && actionList().every(hasTargets)) {
        elements.form.append(make('div', t('selectRecord'), 'shd-widget-actions-hint'));
      }
      return;
    }
    elements.selection.textContent = state.selected ? text(state.selected.title || state.selected.name || state.selected.id || '') : '';
    elements.submit.hidden = false;
    elements.cancel.hidden = false;
    if (hasTargets(action) && !state.selected) elements.form.append(make('div', t('selectRecord'), 'shd-widget-actions-hint'));
    (action.fields || []).forEach(function (fieldConfig) {
      if (!fieldConfig || !fieldConfig.name || fieldConfig.generated || fieldConfig.type === 'hidden') return;
      var wrapper = make('label', undefined, 'shd-widget-actions-field');
      wrapper.append(make('span', label(fieldConfig.label)));
      wrapper.append(createInput(fieldConfig));
      elements.form.append(wrapper);
    });
    if (action.confirm) {
      var confirmLabel = make('label', undefined, 'shd-widget-actions-confirm');
      var confirm = document.createElement('input');
      confirm.type = 'checkbox';
      confirm.name = '__confirm';
      confirm.required = true;
      confirmLabel.append(confirm, make('span', t('confirm')));
      elements.form.append(confirmLabel);
    }
    var notice = make('div', action.destructive ? t('destructive') : t('warning'), action.destructive ? 'shd-widget-actions-warning shd-widget-actions-danger' : 'shd-widget-actions-warning');
    elements.form.append(notice);
  }

  function coerce(value, type) {
    if (type === 'number') {
      var number = Number(value);
      return Number.isFinite(number) ? number : value;
    }
    if (type === 'checkbox') return Boolean(value);
    if (type === 'json') {
      try { return JSON.parse(value); } catch (error) { throw new Error(t('invalidJson')); }
    }
    return value;
  }

  function targetType(name) {
    return /^(task|document|contract|booking|item|monitor|proposal|approval|page|notification|topic|membership|organization|space|status|project)_?id$/.test(name) || name === 'issue_number' || name === 'number' ? 'number' : 'text';
  }

  function targetList(action) {
    if (Array.isArray(action.targets)) return action.targets;
    return action.target ? [action.target] : [];
  }

  function collectArguments(action) {
    var args = Object.assign({}, action.fixed || {});
    (action.context || []).forEach(function (name) {
      var value = firstValue([name]);
      if (value !== undefined && value !== null && value !== '') args[name] = value;
    });
    targetList(action).forEach(function (targetConfig) {
      var value = firstValue(targetConfig.source || targetConfig.name);
      if (value === undefined || value === null || value === '') throw new Error(t('selectRecord'));
      args[targetConfig.name] = coerce(value, targetConfig.type || targetType(targetConfig.name));
    });
    (action.fields || []).forEach(function (fieldConfig) {
      if (!fieldConfig || !fieldConfig.name || fieldConfig.generated || fieldConfig.type === 'hidden') return;
      var input = Array.prototype.find.call(elements.form.querySelectorAll('[name]'), function (node) {
        return node.getAttribute('name') === fieldConfig.name;
      });
      if (!input) return;
      var raw = fieldConfig.type === 'checkbox' ? input.checked : input.value.trim();
      if (raw === '' && !input.checked && !fieldConfig.required) return;
      if (raw === '' && fieldConfig.required) throw new Error(t('required'));
      args[fieldConfig.name] = coerce(raw, fieldConfig.type || 'text');
    });
    if (action.idempotencyKey) args.idempotency_key = 'shd-widget-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
    if (action.confirmArg) args.confirm = true;
    return args;
  }

  function setStatus(message, error) {
    elements.status.textContent = message || '';
    elements.status.className = 'shd-widget-actions-status' + (error ? ' shd-widget-actions-status-error' : '');
  }

  function submitAction() {
    if (state.busy || !state.action) return;
    var action = state.action;
    var args;
    try { args = collectArguments(action); } catch (error) { setStatus(error.message || t('failure'), true); return; }
    state.busy = true;
    elements.submit.disabled = true;
    elements.cancel.disabled = true;
    setStatus(t('loading'), false);
    request('tools/call', { name: action.tool, arguments: args }).then(function (result) {
      unwrap(result);
      setStatus(t('success'), false);
      var refresh = document.getElementById('refresh');
      if (refresh && typeof refresh.click === 'function') window.setTimeout(function () { refresh.click(); }, 250);
    }).catch(function (error) {
      setStatus(error && error.message ? error.message : t('failure'), true);
    }).finally(function () {
      state.busy = false;
      elements.submit.disabled = false;
      elements.cancel.disabled = false;
    });
  }

  function recordFromNode(node) {
    var content = String(node.textContent || '').toLowerCase();
    var exact = state.records.find(function (item) {
      var id = text(item.id || item.code || item.key || item.number).toLowerCase();
      return id && content.indexOf(id) !== -1;
    });
    if (exact) return exact;
    return state.records.find(function (item) {
      var title = text(item.title || item.name || item.display_name || item.number).toLowerCase();
      return title && content.indexOf(title) !== -1;
    }) || null;
  }

  function update(value) {
    var payload = normalize(value) || {};
    var widget = widgetFrom(payload);
    if (Object.keys(widget).length) state.widget = widget;
    var records = recordsFrom(payload);
    if (records.length || Array.isArray(payload.data) || Array.isArray(payload.items) || Array.isArray(payload.projects)) state.records = records;
    ensurePanel();
    var actions = actionList();
    elements.panel.hidden = actions.length === 0;
    if (actions.length && !state.action) renderForm();
    else if (actions.length) renderForm();
  }

  document.addEventListener('click', function (event) {
    var node = event.target && event.target.closest ? event.target.closest('.record,.project-row,.visual-card,.progress-card,.preview-card,.calendar-card,.timeline-card,.kanban-card') : null;
    if (!node || (elements.panel && elements.panel.contains(node))) return;
    var item = recordFromNode(node);
    if (!item) return;
    state.selected = item;
    ensurePanel();
    renderForm();
  }, true);

  window.addEventListener('message', function (event) {
    if (event.source !== window.parent) return;
    var message = event.data;
    if (!message || message.jsonrpc !== '2.0') return;
    if (message.id !== undefined && pending.has(message.id)) {
      var requestState = pending.get(message.id);
      pending.delete(message.id);
      window.clearTimeout(requestState.timeout);
      if (message.error) requestState.reject(new Error(message.error.message || t('failure')));
      else requestState.resolve(message.result);
      return;
    }
    if (message.method === 'ui/notifications/tool-input' || message.method === 'ui/notifications/tool-result') update(message.params || {});
  }, { passive: true });

  ensurePanel();
  var initial = typeof window !== 'undefined' && window.openai ? (window.openai.toolOutput || window.openai.toolInput) : null;
  if (initial) update(initial);
}());
