import React, { useState } from 'react';
import  { 
  ClipboardList, CheckCircle, XCircle, User, Star, LogOut, 
  Plus, Edit, Eye, Clock, PlayCircle, Send, StarHalf, Trash2, Tag,
  Users, Download, GraduationCap, Briefcase, Key, UserPlus, Lock,
  Rocket, Layout, Award, ArrowLeft, BarChart,
  MapPin, Phone, Mail, Building, AlertTriangle
} from 'lucide-react';


// --- MOCK DATA ---
const INITIAL_USERS = [
  { id: 'a1', role: 'admin', name: 'Bu Siti (Administrator)', username: 'admin', password: '123' },
  { id: 'c1', role: 'client', name: 'PT Maju Bersama', username: 'client', password: '123', profile: { address: '', phone: '', email: '' } },
  { id: 't1', role: 'teacher', name: 'Pak Budi (Guru/Pembimbing)', username: 'guru', password: '123' },
  { id: 's1', role: 'student', name: 'Andi Saputra (Murid)', className: 'XII RPL 1', username: 'andi', password: '123' },
  { id: 's2', role: 'student', name: 'Budi Santoso (Murid)', className: 'XII MM 2', username: 'budi', password: '123' },
];

const INITIAL_CATEGORIES = [
  { id: 'cat1', name: 'Website & Aplikasi' },
  { id: 'cat2', name: 'Desain Grafis' },
  { id: 'cat3', name: 'Video & Animasi' }
];

const INITIAL_PROJECT_TYPES = [
  { id: 'pt1', name: 'Sekolah', maxPoints: 100 },
  { id: 'pt2', name: 'Perorangan', maxPoints: 80 },
  { id: 'pt3', name: 'Perusahaan', maxPoints: 150 }
];

const INITIAL_ORDERS = [
  {
    id: '1',
    title: 'Pembuatan Website Company Profile',
    description: 'Membutuhkan website company profile dengan 5 halaman: Home, About, Services, Portfolio, Contact.',
    clientId: 'c1',
    status: 'pending',
    studentIds: [],
    progress: 0,
    reviewNotes: '',
    rating: null,
    createdAt: new Date().toISOString(),
    deadline: '2026-03-15',
    exampleImage: null,
    category: 'Website & Aplikasi',
    projectType: 'Perusahaan'
  },
  {
    id: '2',
    title: 'Desain Logo Produk Baru',
    description: 'Desain logo untuk produk minuman kekinian. Gaya minimalis dan modern.',
    clientId: 'c1',
    status: 'open',
    studentIds: [],
    progress: 0,
    reviewNotes: '',
    rating: null,
    createdAt: new Date().toISOString(),
    deadline: '2026-02-28',
    exampleImage: null,
    category: 'Desain Grafis',
    projectType: 'Perorangan'
  }
];

// --- MAIN APP COMPONENT ---
export default function App() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [projectTypes, setProjectTypes] = useState(INITIAL_PROJECT_TYPES);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  // State form ambil projek
  const [takeFormVisible, setTakeFormVisible] = useState(false);
  const [takeType, setTakeType] = useState('sendiri');
  const [teamMembers, setTeamMembers] = useState([]);

  // State form edit tim
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editTeamType, setEditTeamType] = useState('sendiri');
  const [editTeamMembers, setEditTeamMembers] = useState([]);

  // State untuk edit pengguna (admin)
  const [editingUser, setEditingUser] = useState(null);
  
  // State untuk filter kelas di laporan admin
  const [selectedClassFilter, setSelectedClassFilter] = useState('');

  // State untuk profil client
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // --- ACTIONS ---
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const u = e.target.username.value;
    const p = e.target.password.value;
    const foundUser = users.find(user => user.username === u && user.password === p);
    
    if (foundUser) {
      setUser(foundUser);
      setActiveTab('dashboard');
      setLoginError('');
    } else {
      setLoginError('Username atau password salah!');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
    setSelectedOrder(null);
    setTakeFormVisible(false);
    setTakeType('sendiri');
    setTeamMembers([]);
    setIsEditingTeam(false);
    setLoginError('');
    setShowLogin(false);
    setIsEditingProfile(false);
  };

  const createOrder = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageFile = formData.get('exampleImage');
    const imageUrl = imageFile && imageFile.size > 0 ? URL.createObjectURL(imageFile) : null;

    const newOrder = {
      id: Date.now().toString(),
      title: formData.get('title'),
      category: formData.get('category'),
      projectType: formData.get('projectType'),
      description: formData.get('description'),
      clientId: user.id,
      status: 'pending',
      studentIds: [],
      progress: 0,
      reviewNotes: '',
      rating: null,
      createdAt: new Date().toISOString(),
      deadline: formData.get('deadline'),
      exampleImage: imageUrl
    };
    setOrders([newOrder, ...orders]);
    setActiveTab('dashboard');
  };

  const updateOrderStatus = (orderId, newStatus, additionalData = {}) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus, ...additionalData };
      }
      return order;
    }));
    setActiveTab('dashboard');
    setSelectedOrder(null);
  };

  const startEditTeam = (order) => {
    setIsEditingTeam(true);
    setEditTeamType(order.studentIds?.length > 1 ? 'kelompok' : 'sendiri');
    setEditTeamMembers(order.studentIds || []);
  };

  const saveEditTeam = () => {
    if (editTeamMembers.length === 0) return;
    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        const updatedOrder = { ...order, studentIds: editTeamMembers };
        setSelectedOrder(updatedOrder);
        return updatedOrder;
      }
      return order;
    });
    setOrders(updatedOrders);
    setIsEditingTeam(false);
  };

  const submitReview = (e) => {
    e.preventDefault();
    const notes = new FormData(e.target).get('notes');
    updateOrderStatus(selectedOrder.id, 'in_progress', { reviewNotes: notes, progress: 99 });
  };

  const acceptAndRateProject = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const points = parseInt(formData.get('points'), 10);
    const stars = parseInt(formData.get('stars'), 10);
    updateOrderStatus(selectedOrder.id, 'completed', { 
      rating: { points, stars },
      progress: 100 
    });
  };

  const addCategory = (e) => {
    e.preventDefault();
    const name = new FormData(e.target).get('categoryName');
    if (name) {
      setCategories([...categories, { id: Date.now().toString(), name }]);
      e.target.reset();
    }
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const addProjectType = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('typeName');
    const maxPoints = parseInt(formData.get('maxPoints'), 10);
    if (name && maxPoints) {
      setProjectTypes([...projectTypes, { id: Date.now().toString(), name, maxPoints }]);
      e.target.reset();
    }
  };

  const deleteProjectType = (id) => {
    setProjectTypes(projectTypes.filter(pt => pt.id !== id));
  };

  const addStudent = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('studentName');
    const className = formData.get('studentClass');
    const username = formData.get('username');
    const password = formData.get('password');
    if (name && className && username && password) {
      setUsers([...users, { id: `s${Date.now()}`, role: 'student', name, className, username, password }]);
      e.target.reset();
      alert(`Berhasil menambahkan murid: ${name}`);
    }
  };

  const addTeacher = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('teacherName');
    const username = formData.get('username');
    const password = formData.get('password');
    if (name && username && password) {
      setUsers([...users, { id: `t${Date.now()}`, role: 'teacher', name, username, password }]);
      e.target.reset();
    }
  };

  const saveEditUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const username = formData.get('username');
    const password = formData.get('password');
    const className = formData.get('className');

    setUsers(users.map(u => {
      if (u.id === editingUser.id) {
        return { ...u, name, username, password, className: className || u.className };
      }
      return u;
    }));
    setEditingUser(null);
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const saveClientProfile = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const address = formData.get('address');
    const phone = formData.get('phone');
    const email = formData.get('email');

    const updatedUser = {
      ...user,
      name,
      profile: { address, phone, email }
    };

    setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    setUser(updatedUser);
    setIsEditingProfile(false);
  };

  const getStudentStats = (studentId) => {
    const studentOrders = orders.filter(o => o.studentIds?.includes(studentId) && o.status === 'completed' && o.rating);
    const totalProjects = studentOrders.length;
    const totalPoints = studentOrders.reduce((sum, o) => sum + o.rating.points, 0);
    const avgStars = totalProjects > 0 ? (studentOrders.reduce((sum, o) => sum + o.rating.stars, 0) / totalProjects).toFixed(1) : 0;
    return { totalProjects, totalPoints, avgStars };
  };

  const downloadReport = () => {
    let students = users.filter(u => u.role === 'student');
    
    // Terapkan filter kelas jika ada yang dipilih
    if (selectedClassFilter) {
      students = students.filter(u => u.className === selectedClassFilter);
    }

    let csvContent = "Nama Murid,Kelas,Total Projek,Total Poin,Rata-rata Bintang\n";

    students.forEach(student => {
      const stats = getStudentStats(student.id);
      const row = `"${student.name}","${student.className}",${stats.totalProjects},${stats.totalPoints},${stats.avgStars}`;
      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "laporan_poin_murid.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- UTILS ---
  const getStatusBadge = (status) => {
    const badges = {
      pending: <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Menunggu Verifikasi</span>,
      open: <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Open (Bisa Diambil)</span>,
      rejected: <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Ditolak</span>,
      in_progress: <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-medium">Sedang Dikerjakan</span>,
      review: <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Review Client</span>,
      completed: <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">Selesai</span>,
    };
    return badges[status] || null;
  };

  // Logo Component for consistency
  const AppLogo = ({ className }) => (
    <img 
      src="LOGO SMK IT.jpg" 
      alt="Logo SMK IT As-Syifa" 
      className={`object-contain bg-white rounded-full ${className}`}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = 'https://ui-avatars.com/api/?name=TeFa&background=0d9488&color=fff&rounded=true';
      }}
    />
  );

  // --- RENDERERS ---
  if (!user) {
    if (showLogin) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 relative">
          <button 
            onClick={() => setShowLogin(false)} 
            className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" /> Kembali ke Beranda
          </button>

          <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden mt-16 md:mt-0">
            <div className="bg-teal-600 p-8 text-center flex flex-col items-center">
              <AppLogo className="w-20 h-20 mb-3 shadow-md border-2 border-white/50" />
              <h1 className="text-3xl font-bold text-white mb-2">TeFa Hub</h1>
              <p className="text-teal-100 text-sm">Sistem Manajemen Teaching Factory SMK</p>
            </div>
            
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Masuk ke Akun Anda</h2>
              
              {loginError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    <input 
                      type="text" name="username" required placeholder="Masukkan username..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    <input 
                      type="password" name="password" required placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-teal-600 text-white font-semibold py-2.5 rounded-lg hover:bg-teal-700 transition-colors">
                  Login
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-3 text-center uppercase tracking-wider">Info Akun Demo</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="bg-gray-50 p-2 rounded"><b>Admin:</b> admin / 123</div>
                  <div className="bg-gray-50 p-2 rounded"><b>Client:</b> client / 123</div>
                  <div className="bg-gray-50 p-2 rounded"><b>Guru:</b> guru / 123</div>
                  <div className="bg-gray-50 p-2 rounded"><b>Murid:</b> andi / 123</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const openOrders = orders.filter(o => o.status === 'open');
    const progressOrders = orders.filter(o => o.status === 'in_progress' || o.status === 'review');
    const completedOrders = orders.filter(o => o.status === 'completed');

    const renderPublicOrderCard = (order) => (
      <div key={order.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1" title={order.title}>{order.title}</h3>
          {getStatusBadge(order.status)}
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {order.category && (
            <div className="flex items-center gap-1 text-xs text-teal-600 bg-teal-50 w-fit px-2 py-1 rounded-md border border-teal-100">
              <Tag className="w-3 h-3" /> <span className="font-medium">{order.category}</span>
            </div>
          )}
          {order.projectType && (
            <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 w-fit px-2 py-1 rounded-md border border-amber-200">
              <Briefcase className="w-3 h-3" /> <span className="font-medium">{order.projectType}</span>
            </div>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{order.description}</p>
        
        {order.status === 'completed' && order.rating && (
          <div className="flex items-center gap-1 mt-auto pt-3 border-t border-gray-50">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
            <span className="text-sm font-medium text-gray-700">{order.rating.stars}/5 Bintang dari Klien</span>
          </div>
        )}
      </div>
    );

    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* LANDING HEADER */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <AppLogo className="w-10 h-10 shadow-sm border border-gray-100" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">TeFa As-Syifa</h1>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest hidden sm:block mt-0.5">SMK-IT As-Syifa Boarding School</p>
                </div>
              </div>
              <button 
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm shadow-sm"
              >
                <Lock className="w-4 h-4" /> Masuk Sistem
              </button>
            </div>
          </div>
        </header>

        {/* HERO SECTION */}
        <div className="bg-gradient-to-br from-teal-800 via-teal-600 to-cyan-800 text-white py-20 lg:py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
            <div className="absolute top-1/2 right-10 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-teal-500/30 border border-teal-400/30 text-teal-100 text-xs font-semibold tracking-wider mb-6 uppercase">
              Inovasi • Kolaborasi • Solusi
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              Teaching Factory <br className="hidden md:block"/> SMK-IT As-Syifa Subang
            </h2>
            <p className="text-lg md:text-xl text-teal-100 max-w-3xl mx-auto mb-10 leading-relaxed">
              Wadah kreasi talenta muda berbakat dalam menghasilkan produk dan layanan digital berstandar industri. Kami siap menjadi solusi IT terbaik untuk kebutuhan Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => { setShowLogin(true); }} className="bg-white text-teal-700 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-lg">
                Ajukan Projek Sekarang
              </button>
              <a href="#showcase" className="bg-teal-500/20 text-white border border-teal-400/30 px-8 py-3.5 rounded-xl font-bold hover:bg-teal-500/40 transition-colors backdrop-blur-sm">
                Lihat Portofolio Kami
              </a>
            </div>
          </div>
        </div>

        {/* STATS OVERVIEW */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-5">
              <div className="bg-green-100 p-4 rounded-xl text-green-600"><Rocket className="w-8 h-8" /></div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Lowongan Projek</p>
                <p className="text-3xl font-bold text-gray-900">{openOrders.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-5">
              <div className="bg-cyan-100 p-4 rounded-xl text-cyan-600"><BarChart className="w-8 h-8" /></div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Sedang Dikerjakan</p>
                <p className="text-3xl font-bold text-gray-900">{progressOrders.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-5">
              <div className="bg-emerald-100 p-4 rounded-xl text-emerald-600"><Award className="w-8 h-8" /></div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Projek Selesai</p>
                <p className="text-3xl font-bold text-gray-900">{completedOrders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* PROJECT LISTS */}
        <div id="showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
          
          {/* Section: Open Projects */}
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Rocket className="w-6 h-6 text-green-600" /> Lowongan Projek Tersedia
                </h2>
                <p className="text-gray-500 mt-1">Projek yang siap dikerjakan oleh murid SMK-IT As-Syifa.</p>
              </div>
            </div>
            {openOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-10 bg-white rounded-xl border border-gray-100 shadow-sm">Belum ada lowongan projek saat ini.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {openOrders.map(renderPublicOrderCard)}
              </div>
            )}
          </section>

          {/* Section: In Progress */}
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BarChart className="w-6 h-6 text-cyan-600" /> Sedang Dalam Pengerjaan
                </h2>
                <p className="text-gray-500 mt-1">Projek yang saat ini sedang dikerjakan oleh tim kami.</p>
              </div>
            </div>
            {progressOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-10 bg-white rounded-xl border border-gray-100 shadow-sm">Tidak ada projek yang sedang berjalan.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {progressOrders.map(renderPublicOrderCard)}
              </div>
            )}
          </section>

          {/* Section: Completed */}
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Award className="w-6 h-6 text-emerald-600" /> Portofolio & Projek Selesai
                </h2>
                <p className="text-gray-500 mt-1">Hasil karya terbaik dari murid-murid kami.</p>
              </div>
            </div>
            {completedOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-10 bg-white rounded-xl border border-gray-100 shadow-sm">Belum ada projek yang diselesaikan.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedOrders.map(renderPublicOrderCard)}
              </div>
            )}
          </section>

        </div>

        {/* FOOTER */}
        <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>© {new Date().getFullYear()} Teaching Factory SMK-IT As-Syifa Boarding School Subang. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  const renderOrderList = (orderList, title, emptyMessage) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      {orderList.length === 0 ? (
        <p className="text-gray-500 bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">{emptyMessage}</p>
      ) : (
        <div className="space-y-4">
          {orderList.map(order => (
            <div key={order.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center gap-5">
              
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg text-gray-900">{order.title}</h3>
                  {getStatusBadge(order.status)}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {order.category && (
                    <div className="flex items-center gap-1 text-xs text-teal-600 bg-teal-50 w-fit px-2 py-1 rounded-md border border-teal-100">
                      <Tag className="w-3.5 h-3.5" /> <span className="font-medium">{order.category}</span>
                    </div>
                  )}
                  {order.projectType && (
                    <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 w-fit px-2 py-1 rounded-md border border-amber-200">
                      <Briefcase className="w-3.5 h-3.5" /> <span className="font-medium">{order.projectType}</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{order.description}</p>

                {order.deadline && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 w-fit px-2.5 py-1 rounded-md border border-gray-100">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Tenggat: <span className="font-medium text-gray-700">{new Date(order.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span></span>
                  </div>
                )}
              </div>

              <div className="w-full md:w-56 shrink-0 flex flex-col justify-center gap-3">
                {order.status === 'in_progress' || order.status === 'review' || order.status === 'completed' ? (
                  <div className="w-full">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{order.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${order.progress === 100 ? 'bg-emerald-500' : 'bg-cyan-500'}`} style={{ width: `${order.progress}%` }}></div>
                    </div>
                  </div>
                ) : null}

                <button
                  onClick={() => { 
                    setSelectedOrder(order); 
                    setActiveTab('order_detail');
                    setTakeFormVisible(false);
                    setTakeType('sendiri');
                    setTeamMembers([]);
                    setIsEditingTeam(false);
                  }}
                  className="w-full py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 transition-colors shadow-sm"
                >
                  Lihat Detail
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDashboard = () => {
    if (user.role === 'admin') {
      // Dapatkan daftar kelas unik untuk dropdown filter
      const uniqueClasses = [...new Set(users.filter(u => u.role === 'student' && u.className).map(u => u.className))];
      
      // Data murid yang sudah difilter
      let filteredStudentsForReport = users.filter(u => u.role === 'student');
      if (selectedClassFilter) {
        filteredStudentsForReport = filteredStudentsForReport.filter(u => u.className === selectedClassFilter);
      }

      return (
        <div className="space-y-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Manajemen Kategori */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-teal-600" /> Kategori Projek
              </h2>
              
              <form onSubmit={addCategory} className="flex gap-2 mb-6">
                <input 
                  type="text" name="categoryName" required placeholder="Nama kategori..."
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm w-full"
                />
                <button type="submit" className="bg-teal-600 text-white px-3 py-2 rounded-lg hover:bg-teal-700 text-sm font-medium">
                  Tambah
                </button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {categories.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">Belum ada kategori.</p>
                ) : (
                  categories.map(cat => (
                    <div key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      <button onClick={() => deleteCategory(cat.id)} className="text-red-500 hover:text-red-700 p-1.5 bg-red-50 rounded hover:bg-red-100 transition-colors" title="Hapus Kategori">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Manajemen Jenis Projek */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-600" /> Jenis Projek
              </h2>
              
              <form onSubmit={addProjectType} className="flex flex-col gap-2 mb-6">
                <input 
                  type="text" name="typeName" required placeholder="Jenis (Cth: Sekolah)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm mb-2"
                />
                <div className="flex gap-2">
                  <input 
                    type="number" name="maxPoints" required placeholder="Max Poin" min="1"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                  <button type="submit" className="bg-amber-600 text-white px-3 py-2 rounded-lg hover:bg-amber-700 text-sm font-medium whitespace-nowrap">
                    Tambah
                  </button>
                </div>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {projectTypes.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">Belum ada jenis projek.</p>
                ) : (
                  projectTypes.map(pt => (
                    <div key={pt.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div>
                        <div className="text-sm font-medium text-gray-700">{pt.name}</div>
                        <div className="text-xs text-gray-500">Max Poin: {pt.maxPoints}</div>
                      </div>
                      <button onClick={() => deleteProjectType(pt.id)} className="text-red-500 hover:text-red-700 p-1.5 bg-red-50 rounded hover:bg-red-100 transition-colors" title="Hapus Jenis Projek">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Manajemen Murid */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" /> Tambah Data Murid
              </h2>
              
              <form onSubmit={addStudent} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nama Lengkap Murid</label>
                  <input 
                    type="text" name="studentName" required placeholder="Contoh: Siti Aminah"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kelas / Jurusan</label>
                  <input 
                    type="text" name="studentClass" required placeholder="Contoh: XII TKJ 1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Username Baru</label>
                    <input type="text" name="username" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" name="password" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium mt-2">
                  Tambahkan Murid
                </button>
              </form>
            </div>

            {/* Manajemen Guru */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-orange-600" /> Tambah Guru Pembimbing
              </h2>
              
              <form onSubmit={addTeacher} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nama Lengkap Guru</label>
                  <input 
                    type="text" name="teacherName" required placeholder="Contoh: Pak Anton, S.Kom"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Username Baru</label>
                    <input type="text" name="username" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" name="password" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm font-medium mt-2">
                  Tambahkan Guru
                </button>
              </form>
            </div>

            {/* Daftar Guru Pembimbing */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600" /> Daftar Guru Pembimbing
              </h2>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-white shadow-sm">
                    <tr className="bg-gray-50 text-gray-700 text-sm border-b border-gray-200">
                      <th className="p-3 font-semibold">Nama Guru</th>
                      <th className="p-3 font-semibold">Username</th>
                      <th className="p-3 font-semibold">Password</th>
                      <th className="p-3 font-semibold text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.role === 'teacher').map(u => (
                      <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-sm text-gray-800 font-medium">{u.name}</td>
                        <td className="p-3 text-sm text-gray-600">{u.username}</td>
                        <td className="p-3 text-sm text-gray-600 font-mono">{u.password}</td>
                        <td className="p-3 text-sm text-center flex justify-center gap-2">
                          <button onClick={() => setEditingUser(u)} className="p-1.5 bg-teal-50 text-teal-600 rounded hover:bg-teal-100" title="Edit Data">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteUser(u.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Hapus Pengguna">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.filter(u => u.role === 'teacher').length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-4 text-center text-sm text-gray-500">Belum ada data guru pembimbing.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Daftar Murid */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" /> Daftar Murid
              </h2>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-white shadow-sm">
                    <tr className="bg-gray-50 text-gray-700 text-sm border-b border-gray-200">
                      <th className="p-3 font-semibold">Nama Murid</th>
                      <th className="p-3 font-semibold">Kelas</th>
                      <th className="p-3 font-semibold">Username</th>
                      <th className="p-3 font-semibold">Password</th>
                      <th className="p-3 font-semibold text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.role === 'student').map(u => (
                      <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-sm text-gray-800 font-medium">{u.name}</td>
                        <td className="p-3 text-sm text-gray-600">{u.className}</td>
                        <td className="p-3 text-sm text-gray-600">{u.username}</td>
                        <td className="p-3 text-sm text-gray-600 font-mono">{u.password}</td>
                        <td className="p-3 text-sm text-center flex justify-center gap-2">
                          <button onClick={() => setEditingUser(u)} className="p-1.5 bg-teal-50 text-teal-600 rounded hover:bg-teal-100" title="Edit Data">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteUser(u.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Hapus Pengguna">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.filter(u => u.role === 'student').length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-4 text-center text-sm text-gray-500">Belum ada data murid.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Laporan Poin Murid */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" /> Laporan Progress Poin Murid
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <select 
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="">Semua Kelas</option>
                  {uniqueClasses.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
                <button 
                  onClick={downloadReport}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" /> Download Laporan (CSV)
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 text-sm border-b border-gray-200">
                    <th className="p-3 font-semibold">Nama Murid</th>
                    <th className="p-3 font-semibold">Kelas</th>
                    <th className="p-3 font-semibold text-center">Projek Selesai</th>
                    <th className="p-3 font-semibold text-center">Total Poin</th>
                    <th className="p-3 font-semibold text-center">Rata-rata Bintang</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudentsForReport.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-sm text-gray-500">Tidak ada data murid di kelas ini.</td>
                    </tr>
                  ) : (
                    filteredStudentsForReport.map(student => {
                      const stats = getStudentStats(student.id);
                      return (
                        <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-3 text-sm text-gray-800 font-medium">{student.name}</td>
                          <td className="p-3 text-sm text-gray-600">{student.className}</td>
                          <td className="p-3 text-sm text-center">
                            <span className="bg-teal-100 text-teal-800 px-2.5 py-1 rounded-full text-xs font-semibold">{stats.totalProjects}</span>
                          </td>
                          <td className="p-3 text-sm text-center">
                            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-semibold">{stats.totalPoints}</span>
                          </td>
                          <td className="p-3 text-sm text-center flex justify-center items-center gap-1">
                            {stats.avgStars} <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rekap Orderan */}
          <div className="pt-4">
            {renderOrderList(orders, 'Semua Projek Sistem', 'Belum ada projek di dalam sistem.')}
          </div>

          {/* Modal Edit User */}
          {editingUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-teal-600" /> Edit Data {editingUser.role === 'teacher' ? 'Guru' : 'Murid'}
                </h2>
                <form onSubmit={saveEditUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input type="text" name="name" defaultValue={editingUser.name} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
                  </div>
                  {editingUser.role === 'student' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kelas / Jurusan</label>
                      <input type="text" name="className" defaultValue={editingUser.className} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input type="text" name="username" defaultValue={editingUser.username} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="text" name="password" defaultValue={editingUser.password} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
                    <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700">Simpan Perubahan</button>
                    <button type="button" onClick={() => setEditingUser(null)} className="flex-1 bg-gray-50 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 border border-gray-200">Batal</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (user.role === 'client') {
      const myOrders = orders.filter(o => o.clientId === user.id);
      const isProfileComplete = user.profile && user.profile.address && user.profile.phone;

      return (
        <div>
          {!isProfileComplete && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-3">
                <div className="mt-0.5"><AlertTriangle className="w-5 h-5 text-amber-600" /></div>
                <div>
                  <h3 className="text-amber-800 font-bold text-sm">Profil Belum Lengkap!</h3>
                  <p className="text-amber-700 text-sm mt-1">Silakan lengkapi profil Anda (Alamat & No. HP) sebelum mengajukan orderan projek.</p>
                </div>
              </div>
              <button onClick={() => setIsEditingProfile(true)} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shadow-sm">
                Lengkapi Profil
              </button>
            </div>
          )}

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Building className="w-5 h-5 text-teal-600" /> Profil Klien</h2>
              <button onClick={() => setIsEditingProfile(true)} className="text-teal-600 hover:bg-teal-50 p-2 rounded-lg transition-colors border border-teal-200 text-sm font-medium flex items-center gap-2">
                <Edit className="w-4 h-4" /> Edit Profil
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Nama Klien / Perusahaan</p>
                <p className="text-sm text-gray-800 font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Alamat Lengkap</p>
                <p className="text-sm text-gray-800 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" /> 
                  {user.profile?.address || <span className="text-red-500 italic">Belum diisi</span>}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">No. HP / WhatsApp</p>
                <p className="text-sm text-gray-800 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" /> 
                  {user.profile?.phone || <span className="text-red-500 italic">Belum diisi</span>}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Email</p>
                <p className="text-sm text-gray-800 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" /> 
                  {user.profile?.email || '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Client</h1>
            <button
              onClick={() => setActiveTab('new_order')}
              disabled={!isProfileComplete}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${!isProfileComplete ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm'}`}
              title={!isProfileComplete ? "Lengkapi profil Anda terlebih dahulu" : "Ajukan orderan baru"}
            >
              <Plus className="w-4 h-4" /> Ajukan Orderan
            </button>
          </div>
          {renderOrderList(myOrders.filter(o => ['pending', 'open', 'rejected'].includes(o.status)), 'Orderan Menunggu & Open', 'Belum ada orderan baru.')}
          {renderOrderList(myOrders.filter(o => ['in_progress', 'review'].includes(o.status)), 'Projek Berjalan & Review', 'Tidak ada projek berjalan.')}
          {renderOrderList(myOrders.filter(o => o.status === 'completed'), 'Projek Selesai', 'Belum ada projek selesai.')}

          {/* Modal Edit Profile */}
          {isEditingProfile && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-teal-600" /> Lengkapi Profil Klien
                </h2>
                <form onSubmit={saveClientProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Klien / Perusahaan <span className="text-red-500">*</span></label>
                    <input type="text" name="name" defaultValue={user.name} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap <span className="text-red-500">*</span></label>
                    <textarea name="address" defaultValue={user.profile?.address} required rows="3" placeholder="Contoh: Jl. Sudirman No. 1, Jakarta" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. HP / WhatsApp <span className="text-red-500">*</span></label>
                    <input type="text" name="phone" defaultValue={user.profile?.phone} required placeholder="Contoh: 08123456789" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(Opsional)</span></label>
                    <input type="email" name="email" defaultValue={user.profile?.email} placeholder="Contoh: kontak@perusahaan.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
                    <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors">Simpan Profil</button>
                    <button type="button" onClick={() => setIsEditingProfile(false)} className="flex-1 bg-gray-50 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 border border-gray-200 transition-colors">Batal</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (user.role === 'teacher') {
      return (
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Guru (Verifikator)</h1>
          {renderOrderList(orders.filter(o => o.status === 'pending'), 'Menunggu Verifikasi', 'Tidak ada orderan baru untuk diverifikasi.')}
          {renderOrderList(orders.filter(o => !['pending', 'rejected'].includes(o.status)), 'Semua Projek Aktif & Selesai', 'Belum ada projek aktif.')}
        </div>
      );
    }

    if (user.role === 'student') {
      const myJobs = orders.filter(o => o.studentIds?.includes(user.id));
      const openJobs = orders.filter(o => o.status === 'open');
      return (
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Murid</h1>
          {renderOrderList(myJobs.filter(o => o.status === 'in_progress' || o.status === 'review'), 'Projek Saya (Aktif)', 'Anda belum mengambil projek.')}
          {renderOrderList(openJobs, 'Lowongan Projek (Open)', 'Tidak ada projek open saat ini.')}
          {renderOrderList(myJobs.filter(o => o.status === 'completed'), 'Portofolio Saya', 'Belum ada projek selesai.')}
        </div>
      );
    }
  };

  const renderOrderDetail = () => {
    if (!selectedOrder) return null;
    const o = selectedOrder;
    const clientData = users.find(u => u.id === o.clientId);

    return (
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-100 p-6 flex justify-between items-start">
          <div>
            <button onClick={() => setActiveTab('dashboard')} className="text-sm text-teal-600 hover:underline mb-2 block">← Kembali ke Dashboard</button>
            <h1 className="text-2xl font-bold text-gray-900">{o.title}</h1>
            <p className="text-gray-500 text-sm mt-1">Order ID: #{o.id}</p>
          </div>
          <div>{getStatusBadge(o.status)}</div>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Deskripsi Kebutuhan</h3>
              {o.category && (
                <span className="text-xs px-2 py-0.5 bg-teal-100 text-teal-700 rounded-md font-medium border border-teal-200">{o.category}</span>
              )}
              {o.projectType && (
                <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md font-medium border border-amber-200">{o.projectType}</span>
              )}
            </div>
            <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{o.description}</p>
          </div>

          {/* Ringkasan Profil Klien */}
          {clientData && clientData.profile && (
            <div className="bg-white border border-gray-200 p-5 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Building className="w-4 h-4 text-teal-600" /> Profil Pemesan (Klien)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Nama / Perusahaan</p>
                  <p className="text-sm text-gray-900 font-semibold">{clientData.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Kontak</p>
                  <p className="text-sm text-gray-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> {clientData.profile.phone || '-'}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-500 font-medium mb-1">Alamat</p>
                  <p className="text-sm text-gray-800 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" /> {clientData.profile.address || '-'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Tenggat Waktu</h3>
              <div className="flex items-center gap-2 text-gray-800 bg-gray-50 p-3 rounded-lg w-fit">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="font-medium">
                  {o.deadline ? new Date(o.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                </span>
              </div>
            </div>
            
            {o.exampleImage && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Gambar Contoh</h3>
                <img src={o.exampleImage} alt="Gambar Contoh" className="max-h-48 rounded-lg border border-gray-200 shadow-sm object-cover" />
              </div>
            )}
          </div>

          {(o.status === 'in_progress' || o.status === 'review' || o.status === 'completed') && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Tim Pengerja</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {o.studentIds?.map(id => {
                  const s = users.find(u => u.id === id);
                  return s ? <span key={id} className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 flex items-center gap-2"><User className="w-4 h-4 text-gray-500"/> {s.name}</span> : null;
                })}
              </div>

              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Status Pengerjaan</h3>
              <div className="bg-cyan-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm text-cyan-800 font-medium mb-2">
                  <span>Progress Murid</span>
                  <span>{o.progress}%</span>
                </div>
                <div className="w-full bg-cyan-200 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all ${o.progress === 100 ? 'bg-emerald-500' : 'bg-cyan-600'}`} style={{ width: `${o.progress}%` }}></div>
                </div>
                {o.reviewNotes && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    <span className="font-semibold">Catatan Revisi Client:</span> {o.reviewNotes}
                  </div>
                )}
              </div>
            </div>
          )}

          {o.status === 'completed' && o.rating && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Hasil Penilaian Client</h3>
              <div className="bg-teal-50 p-4 rounded-lg flex items-center gap-6 border border-teal-100">
                <div className="text-center">
                  <span className="block text-3xl font-bold text-teal-700">{o.rating.points}</span>
                  <span className="text-xs text-teal-600 font-medium uppercase">Poin (1-100)</span>
                </div>
                <div className="border-l border-teal-200 h-12"></div>
                <div>
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-6 h-6 ${star <= o.rating.stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-teal-600 font-medium uppercase">Bintang ({o.rating.stars}/5)</span>
                </div>
              </div>
            </div>
          )}

          {/* --- ACTIONS BASED ON ROLE AND STATUS --- */}
          <div className="pt-6 border-t border-gray-100 flex gap-3 flex-wrap">
            
            {/* GURU: Verifikasi */}
            {user.role === 'teacher' && o.status === 'pending' && (
              <>
                <button onClick={() => updateOrderStatus(o.id, 'open')} className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700">
                  <CheckCircle className="w-5 h-5" /> Setujui (Open)
                </button>
                <button onClick={() => updateOrderStatus(o.id, 'rejected')} className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700">
                  <XCircle className="w-5 h-5" /> Tolak Orderan
                </button>
              </>
            )}

            {/* GURU: Edit Tim Pengerja */}
            {user.role === 'teacher' && (o.status === 'in_progress' || o.status === 'review') && (
              <div className="w-full bg-amber-50 p-5 rounded-lg border border-amber-200">
                {!isEditingTeam ? (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="font-semibold text-amber-900 mb-1">Manajemen Tim Pengerja</h4>
                      <p className="text-sm text-amber-700">Ubah opsi pengerjaan (sendiri/kelompok) atau atur anggota tim.</p>
                    </div>
                    <button onClick={() => startEditTeam(o)} className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 text-sm font-medium whitespace-nowrap">
                      <Edit className="w-4 h-4" /> Edit Tim
                    </button>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-4">Edit Tim Pengerja</h4>
                    <div className="flex flex-col sm:flex-row gap-6 mb-5">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="editTakeType" value="sendiri" checked={editTeamType === 'sendiri'} 
                          onChange={() => { 
                            setEditTeamType('sendiri'); 
                            if(editTeamMembers.length > 1) setEditTeamMembers([editTeamMembers[0]]); 
                          }} 
                          className="w-4 h-4 text-amber-600 focus:ring-amber-500" 
                        />
                        <span className="text-amber-800 font-medium">Dikerjakan Sendiri</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="editTakeType" value="kelompok" checked={editTeamType === 'kelompok'} onChange={() => setEditTeamType('kelompok')} className="w-4 h-4 text-amber-600 focus:ring-amber-500" />
                        <span className="text-amber-800 font-medium">Dikerjakan Berkelompok</span>
                      </label>
                    </div>
                    
                    <div className="mb-5 bg-white p-4 rounded-lg border border-amber-100">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Pilih Anggota Tim:</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {users.filter(u => u.role === 'student').map(u => (
                          <label key={u.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer border border-transparent hover:border-gray-200 transition-colors">
                            <input 
                              type={editTeamType === 'sendiri' ? 'radio' : 'checkbox'} 
                              name="editTeamMemberGroup"
                              checked={editTeamMembers.includes(u.id)}
                              onChange={(e) => {
                                if (editTeamType === 'sendiri') {
                                   setEditTeamMembers([u.id]);
                                } else {
                                   if(e.target.checked) setEditTeamMembers([...editTeamMembers, u.id]);
                                   else setEditTeamMembers(editTeamMembers.filter(id => id !== u.id));
                                }
                              }}
                              className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                            />
                            <span className="text-sm text-gray-800 font-medium">{u.name} <span className="text-gray-500 font-normal">({u.className})</span></span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={saveEditTeam}
                        disabled={editTeamMembers.length === 0}
                        className="bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700 font-medium text-sm disabled:opacity-50"
                      >
                        Simpan Perubahan
                      </button>
                      <button 
                        onClick={() => setIsEditingTeam(false)} 
                        className="bg-white text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100 font-medium text-sm border border-gray-300"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MURID: Ambil Order & Update Progress */}
            {user.role === 'student' && o.status === 'open' && !takeFormVisible && (
              <button onClick={() => setTakeFormVisible(true)} className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 w-full sm:w-auto justify-center">
                <PlayCircle className="w-5 h-5" /> Ambil Projek Ini
              </button>
            )}

            {user.role === 'student' && o.status === 'open' && takeFormVisible && (
              <div className="w-full bg-teal-50 p-5 rounded-lg border border-teal-200">
                <h4 className="font-semibold text-teal-900 mb-4">Opsi Pengerjaan Projek</h4>
                <div className="flex flex-col sm:flex-row gap-6 mb-5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="takeType" value="sendiri" checked={takeType === 'sendiri'} onChange={() => setTakeType('sendiri')} className="w-4 h-4 text-teal-600 focus:ring-teal-500" />
                    <span className="text-teal-800 font-medium">Dikerjakan Sendiri</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="takeType" value="kelompok" checked={takeType === 'kelompok'} onChange={() => setTakeType('kelompok')} className="w-4 h-4 text-teal-600 focus:ring-teal-500" />
                    <span className="text-teal-800 font-medium">Dikerjakan Berkelompok</span>
                  </label>
                </div>
                
                {takeType === 'kelompok' && (
                  <div className="mb-5 bg-white p-4 rounded-lg border border-teal-100">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Pilih Anggota Tim Tambahan:</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {users.filter(u => u.role === 'student' && u.id !== user.id).map(u => (
                        <label key={u.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer border border-transparent hover:border-gray-200 transition-colors">
                          <input 
                            type="checkbox" 
                            checked={teamMembers.includes(u.id)}
                            onChange={(e) => {
                              if(e.target.checked) setTeamMembers([...teamMembers, u.id]);
                              else setTeamMembers(teamMembers.filter(id => id !== u.id));
                            }}
                            className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                          />
                          <span className="text-sm text-gray-800 font-medium">{u.name} <span className="text-gray-500 font-normal">({u.className})</span></span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => updateOrderStatus(o.id, 'in_progress', { studentIds: [user.id, ...(takeType === 'kelompok' ? teamMembers : [])] })}
                    className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 font-medium text-sm"
                  >
                    Konfirmasi & Mulai
                  </button>
                  <button 
                    onClick={() => setTakeFormVisible(false)} 
                    className="bg-white text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100 font-medium text-sm border border-gray-300"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {user.role === 'student' && o.status === 'in_progress' && o.studentIds?.includes(user.id) && (
              <div className="w-full bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-3">Update Progress Tim</h4>
                <div className="flex items-center gap-4 mb-4">
                  <input 
                    type="range" min="0" max="100" value={o.progress} 
                    onChange={(e) => setOrders(orders.map(order => order.id === o.id ? { ...order, progress: parseInt(e.target.value) } : order))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="font-bold text-teal-600 min-w-[3rem] text-right">{o.progress}%</span>
                </div>
                <button 
                  onClick={() => updateOrderStatus(o.id, 'review')}
                  disabled={o.progress < 10}
                  className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" /> Kirim untuk Direview Client
                </button>
                <p className="text-xs text-gray-500 mt-2">*Update progress dan klik kirim agar client bisa mereview hasil kerja Anda.</p>
              </div>
            )}

            {/* CLIENT: Review & Rating */}
            {user.role === 'client' && o.status === 'review' && (
              <div className="w-full grid md:grid-cols-2 gap-6">
                <form onSubmit={submitReview} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-2">Minta Revisi</h4>
                  <textarea 
                    name="notes" required placeholder="Tulis catatan perbaikan..."
                    className="w-full p-2 border border-yellow-300 rounded mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" rows="3"
                  ></textarea>
                  <button type="submit" className="w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 text-sm font-medium">
                    Kirim Catatan Revisi
                  </button>
                </form>

                {(() => {
                  const pt = projectTypes.find(p => p.name === o.projectType);
                  const maxPoints = pt ? pt.maxPoints : 100;
                  
                  return (
                    <form onSubmit={acceptAndRateProject} className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                      <h4 className="font-medium text-teal-800 mb-2">Terima Projek & Beri Nilai</h4>
                      <div className="space-y-3 mb-4">
                        <div>
                          <label className="block text-xs font-medium text-teal-700 mb-1">Poin (1-{maxPoints})</label>
                          <input type="number" name="points" min="1" max={maxPoints} required className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-teal-700 mb-1">Bintang (1-5)</label>
                          <select name="stars" required className="w-full p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500">
                            <option value="5">5 Bintang - Sangat Bagus</option>
                            <option value="4">4 Bintang - Bagus</option>
                            <option value="3">3 Bintang - Cukup</option>
                            <option value="2">2 Bintang - Kurang</option>
                            <option value="1">1 Bintang - Sangat Kurang</option>
                          </select>
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 text-sm font-medium flex justify-center items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Selesaikan Projek
                      </button>
                    </form>
                  );
                })()}
              </div>
            )}

          </div>
        </div>
      </div>
    );
  };

  const renderNewOrderForm = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Ajukan Orderan Baru</h2>
        <button onClick={() => setActiveTab('dashboard')} className="text-sm text-gray-500 hover:text-gray-800">Batal</button>
      </div>
      <form onSubmit={createOrder} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Judul Projek</label>
          <input 
            type="text" name="title" required placeholder="Contoh: Pembuatan Website E-Commerce"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Projek</label>
            <select 
              name="category" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Projek</label>
            <select 
              name="projectType" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              <option value="">-- Pilih Jenis --</option>
              {projectTypes.map(pt => (
                <option key={pt.id} value={pt.name}>{pt.name} (Max: {pt.maxPoints} Poin)</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Detail</label>
          <textarea 
            name="description" required rows="5" placeholder="Jelaskan spesifikasi kebutuhan Anda secara detail..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tenggat Waktu (Deadline)</label>
            <input 
              type="date" name="deadline" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Contoh <span className="text-gray-400 font-normal">(Opsional)</span></label>
            <input 
              type="file" name="exampleImage" accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-teal-600 text-white font-semibold py-3 rounded-lg hover:bg-teal-700 transition-colors">
          Kirim Orderan
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <AppLogo className="w-8 h-8" />
              <span className="text-xl font-bold text-gray-900 tracking-tight">TeFa Hub</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'order_detail' && renderOrderDetail()}
        {activeTab === 'new_order' && renderNewOrderForm()}
      </main>
    </div>
  );
}