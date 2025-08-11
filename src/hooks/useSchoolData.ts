import { useState, useEffect } from 'react';
import { useSchool } from '../contexts/SchoolContext';
import { Teacher } from '../types/User';
import { Student } from '../types/User';
import { ClassInfo } from '../types/Classroom';

export const useSchoolData = () => {
  const { currentSchool } = useSchool();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentSchool) {
      loadSchoolData(currentSchool.id);
    }
  }, [currentSchool]);

  const loadSchoolData = async (schoolId: string) => {
    setIsLoading(true);
    
    try {
      // Charger les données spécifiques à l'école depuis le localStorage
      const savedTeachers = localStorage.getItem(`teachers_${schoolId}`);
      const savedStudents = localStorage.getItem(`students_${schoolId}`);
      const savedClasses = localStorage.getItem(`classes_${schoolId}`);

      if (savedTeachers) {
        setTeachers(JSON.parse(savedTeachers));
      } else {
        // Données par défaut pour la première école
        if (schoolId === 'ecole-1') {
          setTeachers(getDefaultTeachers(schoolId));
        } else {
          setTeachers([]);
        }
      }

      if (savedStudents) {
        setStudents(JSON.parse(savedStudents));
      } else {
        setStudents([]);
      }

      if (savedClasses) {
        setClasses(JSON.parse(savedClasses));
      } else {
        if (schoolId === 'ecole-1') {
          setClasses(getDefaultClasses(schoolId));
        } else {
          setClasses([]);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données de l\'école:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTeachers = (newTeachers: Teacher[]) => {
    if (currentSchool) {
      setTeachers(newTeachers);
      localStorage.setItem(`teachers_${currentSchool.id}`, JSON.stringify(newTeachers));
    }
  };

  const saveStudents = (newStudents: Student[]) => {
    if (currentSchool) {
      setStudents(newStudents);
      localStorage.setItem(`students_${currentSchool.id}`, JSON.stringify(newStudents));
    }
  };

  const saveClasses = (newClasses: ClassInfo[]) => {
    if (currentSchool) {
      setClasses(newClasses);
      localStorage.setItem(`classes_${currentSchool.id}`, JSON.stringify(newClasses));
    }
  };

  return {
    teachers,
    students,
    classes,
    isLoading,
    saveTeachers,
    saveStudents,
    saveClasses,
    currentSchool
  };
};

// Données par défaut pour la première école
const getDefaultTeachers = (schoolId: string): Teacher[] => [
  {
    id: '1',
    firstName: 'Moussa',
    lastName: 'Traore',
    email: 'mtraore@ecoletech.edu',
    phone: '+223 70 11 22 33',
    subjects: ['Français', 'Mathématiques', 'Éveil Scientifique', 'Éducation Civique'],
    assignedClass: 'CI A',
    status: 'Actif',
    experience: '8 ans',
    qualification: 'Licence en Pédagogie',
    hireDate: '2016-09-01',
    salary: 180000,
    address: 'Quartier Hippodrome, Bamako',
    emergencyContact: '+223 65 44 33 22',
    specializations: ['Mathématiques', 'Sciences'],
    performanceRating: 4.5,
    schoolId
  }
];

const getDefaultClasses = (schoolId: string): ClassInfo[] => [
  {
    id: '1',
    name: 'Maternelle 1A',
    level: 'Maternelle',
    students: 25,
    capacity: 30,
    teacher: 'Mme Kone',
    teacherId: 'kone',
    subjects: ['Éveil', 'Langage', 'Graphisme', 'Jeux éducatifs'],
    schoolId
  },
  {
    id: '2',
    name: 'CI A',
    level: 'CI',
    students: 32,
    capacity: 35,
    teacher: 'M. Traore',
    teacherId: 'traore',
    subjects: ['Français', 'Mathématiques', 'Éveil Scientifique', 'Éducation Civique'],
    schoolId
  }
];