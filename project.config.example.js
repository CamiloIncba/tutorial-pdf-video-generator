/**
 * Tutorializator-2049 — Project Configuration
 * 
 * Este archivo define la configuración para generar documentos de un proyecto.
 * Copia este archivo como `project.config.js` en la raíz de tu proyecto.
 * 
 * @example
 * // Ubicación: C:/Proyectos/NOR-PAN/TC/project.config.js
 * // Ejecutar: npx tutorializator init
 */

export default {
  // ═══════════════════════════════════════════════════════════════════════════
  // INFORMACIÓN GENERAL DEL PROYECTO
  // ═══════════════════════════════════════════════════════════════════════════
  
  project: {
    /** Nombre corto del proyecto (usado en carpetas y referencias) */
    code: 'PROYECTO',
    
    /** Nombre completo descriptivo */
    name: 'Sistema de Gestión de Ejemplo',
    
    /** Descripción en una línea */
    description: 'Sistema web para gestionar X procesos del cliente Y',
    
    /** Versión actual */
    version: '1.0.0',
    
    /** Año de copyright */
    year: 2025,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CLIENTE Y EQUIPO
  // ═══════════════════════════════════════════════════════════════════════════
  
  client: {
    /** Nombre del cliente */
    name: 'Cliente S.R.L.',
    
    /** Subcarpeta en C:/Proyectos/ */
    folder: 'CLIENTE',
    
    /** Contacto principal */
    contact: 'Nombre Apellido',
  },
  
  team: {
    /** Project Manager */
    pm: 'Felipe Rebolledo',
    
    /** Desarrollador principal */
    developer: 'Camilo Acencio',
    
    /** Autor de documentos */
    author: 'INCBA',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RUTAS DEL PROYECTO
  // ═══════════════════════════════════════════════════════════════════════════
  
  paths: {
    /** Raíz del proyecto (se auto-detecta si no se especifica) */
    root: null,
    
    /** Carpeta de documentación (-more/) */
    docs: null, // Default: {project.code}-more/
    
    /** Carpeta de screenshots */
    screenshots: null, // Default: {docs}/SS/
    
    /** Carpeta de diagramas */
    diagrams: null, // Default: {docs}/diagrams/
    
    /** Carpeta de backend */
    backend: null, // Default: {project.code}-backend/
    
    /** Carpeta de frontend */
    frontend: null, // Default: {project.code}-frontend/
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // STACK TECNOLÓGICO
  // ═══════════════════════════════════════════════════════════════════════════
  
  stack: {
    frontend: {
      framework: 'React 18',
      build: 'Vite',
      language: 'TypeScript',
      styles: 'TailwindCSS',
      ui: 'shadcn/ui',
      data: 'TanStack Query',
    },
    
    backend: {
      runtime: 'Node.js 20',
      framework: 'NestJS', // o 'Express'
      language: 'TypeScript',
    },
    
    database: {
      type: 'MongoDB',
      provider: 'MongoDB Atlas',
    },
    
    auth: {
      provider: 'Auth0',
      type: 'SPA + API',
    },
    
    hosting: {
      frontend: 'AWS Amplify',
      backend: 'AWS Elastic Beanstalk',
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MÓDULOS Y FUNCIONALIDADES
  // ═══════════════════════════════════════════════════════════════════════════
  
  modules: [
    {
      code: 'MOD-001',
      name: 'Módulo de Ejemplo',
      description: 'Gestión de recursos de ejemplo',
      entity: 'examples',
      icon: 'file',
      endpoints: [
        { method: 'GET', path: '/', description: 'Listar' },
        { method: 'POST', path: '/', description: 'Crear' },
        { method: 'GET', path: '/:id', description: 'Obtener' },
        { method: 'PUT', path: '/:id', description: 'Actualizar' },
        { method: 'DELETE', path: '/:id', description: 'Eliminar' },
      ],
    },
    // Agregar más módulos...
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // ROLES Y PERMISOS
  // ═══════════════════════════════════════════════════════════════════════════
  
  roles: [
    { code: 'admin', name: 'Administrador', permissions: 'Acceso total' },
    { code: 'manager', name: 'Gerente', permissions: 'CRUD en su área' },
    { code: 'operator', name: 'Operador', permissions: 'Crear y ver' },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // CONFIGURACIÓN DE DOCUMENTOS
  // ═══════════════════════════════════════════════════════════════════════════
  
  documents: {
    /** Documentos a generar */
    generate: [
      'SRS',      // Especificación de requisitos
      'PLAN',     // Plan de trabajo
      'CLAUDE',   // Context hub
      'LOVABLE',  // Prompts para mockups
      'README',   // README técnico
      'ERASER',   // DSL para diagramas
      'TUTORIAL', // Tutorial de usuario
    ],
    
    /** Formato de salida para documentos */
    formats: {
      srs: ['md', 'docx'],
      plan: ['md'],
      tutorial: ['md', 'docx', 'mp4'],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TIMELINE Y SPRINTS
  // ═══════════════════════════════════════════════════════════════════════════
  
  timeline: {
    /** Fecha objetivo de entrega */
    targetDate: '2025-06-01',
    
    /** Duración de sprint en semanas */
    sprintDuration: 2,
    
    /** Sprints planificados */
    sprints: [
      { number: 1, goal: 'Setup + Auth + CRUD básico' },
      { number: 2, goal: 'Features principales' },
      { number: 3, goal: 'Dashboard + Reportes' },
      { number: 4, goal: 'Testing + Ajustes' },
      { number: 5, goal: 'Deploy + Capacitación' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TRACKING DE PROGRESO
  // ═══════════════════════════════════════════════════════════════════════════
  
  progress: {
    /** Estado actual del proyecto */
    currentSprint: 1,
    
    /** Progreso por RF (Requisito Funcional) */
    requirements: [
      { code: 'RF-001', name: 'Autenticación', progress: 100 },
      { code: 'RF-002', name: 'CRUD de Recursos', progress: 80 },
      { code: 'RF-003', name: 'Dashboard', progress: 0 },
      // Agregar más RFs...
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEMA VISUAL (para Lovable y exportaciones)
  // ═══════════════════════════════════════════════════════════════════════════
  
  theme: {
    mode: 'dark', // 'light' | 'dark'
    primaryColor: '#3B82F6', // Blue
    secondaryColor: '#10B981', // Green
    
    /** Tema de Tutorializator para exports */
    tutorialTheme: 'shadcn-dark',
    videoTheme: 'shadcn-dark-video',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OPCIONES DE EXPORTACIÓN
  // ═══════════════════════════════════════════════════════════════════════════
  
  export: {
    pdf: {
      theme: 'shadcn-dark',
      headerTitle: null, // Usa project.name si es null
      footerText: '© INCBA {year}',
    },
    
    docx: {
      headerTitle: null,
      footerText: '© INCBA {year}',
    },
    
    video: {
      theme: 'shadcn-dark-video',
      fps: 30,
      resolution: '1920x1080',
      transitionMs: 500,
    },
  },
};
