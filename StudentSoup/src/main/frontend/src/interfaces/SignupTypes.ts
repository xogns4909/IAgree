export interface UniversityDataType {
  schoolId: number;
  schoolName: string;
}
export interface DepartmentType {
  departmentId: number;
  departmentName: string;
}

export interface MajorDataType {
  departments: DepartmentType[];
  domain: string;
  message?: string;
}
