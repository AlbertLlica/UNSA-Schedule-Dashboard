"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockReservations, mockAulas, weekDays, type Reservation } from "@/lib/mock-data"
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function ReservasPage() {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations)

  const handleApproveReservation = (id: string) => {
    setReservations((prev) =>
      prev.map((reservation) => (reservation.id === id ? { ...reservation, status: "approved" } : reservation)),
    )
  }

  const handleRejectReservation = (id: string) => {
    setReservations((prev) =>
      prev.map((reservation) => (reservation.id === id ? { ...reservation, status: "rejected" } : reservation)),
    )
  }

  const getStatusBadge = (status: Reservation["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Pendiente
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Aprobada
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rechazada
          </Badge>
        )
    }
  }

  const getSlotStatus = (aulaId: string, day: string, time: string) => {
    const reservation = reservations.find(
      (r) => r.aulaId === aulaId && r.day === day && r.startTime === time && r.status === "approved",
    )
    return reservation ? { occupied: true, courseName: reservation.courseName } : { occupied: false }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestión de Reservas</h1>
        <p className="text-muted-foreground">Administrar reservas de aulas y horarios</p>
      </div>

      {/* Schedule Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Calendario de Reservas
          </CardTitle>
          <CardDescription>Vista semanal de disponibilidad de aulas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-6 gap-1 mb-2">
                <div className="p-2 font-medium text-center">Aula</div>
                {weekDays.map((day) => (
                  <div key={day} className="p-2 font-medium text-center">
                    {day}
                  </div>
                ))}
              </div>
              {mockAulas.slice(0, 4).map((aula) => (
                <div key={aula.id} className="grid grid-cols-6 gap-1 mb-1">
                  <div className="p-2 font-medium bg-muted rounded text-center">{aula.name}</div>
                  {weekDays.map((day) => {
                    const slot = getSlotStatus(aula.id, day, "10:00")
                    return (
                      <div
                        key={day}
                        className={`p-2 rounded text-center text-xs ${
                          slot.occupied
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-primary text-primary-foreground cursor-pointer hover:opacity-80"
                        }`}
                      >
                        {slot.occupied ? slot.courseName : "Libre"}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Solicitudes de Reserva
          </CardTitle>
          <CardDescription>Gestionar solicitudes pendientes y historial</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profesor</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Aula</TableHead>
                <TableHead>Día y Hora</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">{reservation.professorName}</TableCell>
                  <TableCell>{reservation.courseName}</TableCell>
                  <TableCell>{reservation.aulaName}</TableCell>
                  <TableCell>
                    {reservation.day} {reservation.startTime} - {reservation.endTime}
                  </TableCell>
                  <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                  <TableCell>
                    {reservation.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveReservation(reservation.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Aprobar
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRejectReservation(reservation.id)}>
                          Rechazar
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
